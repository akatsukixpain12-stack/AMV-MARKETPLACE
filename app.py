from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
import json
import hashlib
import cv2
import numpy as np
from PIL import Image
import io
import base64
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import razorpay
import stripe

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///vortex.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Payment Gateway Setup
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '')
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '')
stripe.api_key = STRIPE_SECRET_KEY

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '')

# ==================== DATABASE MODELS ====================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200))
    full_name = db.Column(db.String(100))
    profile_image = db.Column(db.String(500))
    bio = db.Column(db.Text)
    is_seller = db.Column(db.Boolean, default=False)
    balance = db.Column(db.Float, default=0.0)
    trust_score = db.Column(db.Float, default=5.0)
    google_id = db.Column(db.String(100), unique=True)
    upi_id = db.Column(db.String(100))
    bank_account = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    gigs = db.relationship('Gig', backref='seller', lazy=True)
    orders_as_buyer = db.relationship('Order', foreign_keys='Order.buyer_id', backref='buyer', lazy=True)
    orders_as_seller = db.relationship('Order', foreign_keys='Order.seller_id', backref='seller', lazy=True)

class Gig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # amv, gaming, tiktok, motion
    price = db.Column(db.Float, nullable=False)
    delivery_days = db.Column(db.Integer, default=3)
    thumbnail = db.Column(db.String(500))
    video_url = db.Column(db.String(500))
    tags = db.Column(db.Text)  # JSON array
    rating = db.Column(db.Float, default=0.0)
    total_orders = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    content_hash = db.Column(db.String(64))  # For plagiarism detection
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    orders = db.relationship('Order', backref='gig', lazy=True)
    reviews = db.relationship('Review', backref='gig', lazy=True)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    gig_id = db.Column(db.Integer, db.ForeignKey('gig.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed, cancelled, disputed
    escrow_status = db.Column(db.String(20), default='held')  # held, released, refunded
    payment_id = db.Column(db.String(200))
    payment_method = db.Column(db.String(50))  # razorpay, stripe, upi
    delivery_file = db.Column(db.String(500))
    buyer_message = db.Column(db.Text)
    seller_message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    gig_id = db.Column(db.Integer, db.ForeignKey('gig.id'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Withdrawal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    method = db.Column(db.String(50))  # upi, bank_transfer
    upi_id = db.Column(db.String(100))
    bank_details = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, processing, completed, failed
    transaction_id = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    processed_at = db.Column(db.DateTime)

class ContentFingerprint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gig_id = db.Column(db.Integer, db.ForeignKey('gig.id'), nullable=False)
    fingerprint = db.Column(db.Text, nullable=False)  # Perceptual hash
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ==================== HELPER FUNCTIONS ====================

def calculate_perceptual_hash(image_data):
    """Calculate perceptual hash for plagiarism detection"""
    try:
        img = Image.open(io.BytesIO(image_data))
        img = img.convert('L').resize((8, 8), Image.LANCZOS)
        pixels = list(img.getdata())
        avg = sum(pixels) / len(pixels)
        bits = ''.join(['1' if pixel > avg else '0' for pixel in pixels])
        return hex(int(bits, 2))[2:].zfill(16)
    except:
        return None

def hamming_distance(hash1, hash2):
    """Calculate similarity between two hashes"""
    if not hash1 or not hash2:
        return 100
    return sum(c1 != c2 for c1, c2 in zip(hash1, hash2))

def detect_plagiarism(content_hash, threshold=5):
    """Check if content is stolen"""
    all_fingerprints = ContentFingerprint.query.all()
    for fp in all_fingerprints:
        distance = hamming_distance(content_hash, fp.fingerprint)
        if distance <= threshold:
            return True, fp.gig_id
    return False, None

def update_gig_rating(gig_id):
    """Recalculate gig rating based on reviews"""
    reviews = Review.query.filter_by(gig_id=gig_id).all()
    if reviews:
        avg_rating = sum(r.rating for r in reviews) / len(reviews)
        gig = Gig.query.get(gig_id)
        gig.rating = round(avg_rating, 1)
        db.session.commit()

def update_seller_trust_score(user_id):
    """Calculate seller trust score based on performance"""
    user = User.query.get(user_id)
    orders = Order.query.filter_by(seller_id=user_id, status='completed').all()
    
    if not orders:
        return
    
    total_orders = len(orders)
    on_time_delivery = sum(1 for o in orders if o.completed_at and 
                           (o.completed_at - o.created_at).days <= 
                           Gig.query.get(o.gig_id).delivery_days)
    
    reviews = Review.query.join(Order).filter(Order.seller_id == user_id).all()
    avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 5.0
    
    delivery_rate = (on_time_delivery / total_orders) * 100 if total_orders > 0 else 100
    trust_score = (avg_rating * 0.6) + (delivery_rate / 100 * 5 * 0.4)
    
    user.trust_score = round(trust_score, 1)
    db.session.commit()

# ==================== AUTH ROUTES ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 400
    
    user = User(
        email=data['email'],
        username=data['username'],
        full_name=data.get('full_name', ''),
        password_hash=generate_password_hash(data['password'])
    )
    
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=30))
    
    return jsonify({
        'token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'full_name': user.full_name,
            'is_seller': user.is_seller,
            'balance': user.balance,
            'trust_score': user.trust_score
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=30))
    
    return jsonify({
        'token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'full_name': user.full_name,
            'is_seller': user.is_seller,
            'balance': user.balance,
            'trust_score': user.trust_score,
            'profile_image': user.profile_image
        }
    })

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    """Google OAuth login"""
    try:
        token = request.json['token']
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        
        google_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')
        
        user = User.query.filter_by(google_id=google_id).first()
        
        if not user:
            user = User.query.filter_by(email=email).first()
            if user:
                user.google_id = google_id
            else:
                username = email.split('@')[0] + str(User.query.count() + 1)
                user = User(
                    email=email,
                    username=username,
                    full_name=name,
                    google_id=google_id,
                    profile_image=picture
                )
                db.session.add(user)
        
        db.session.commit()
        
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=30))
        
        return jsonify({
            'token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'full_name': user.full_name,
                'is_seller': user.is_seller,
                'balance': user.balance,
                'trust_score': user.trust_score,
                'profile_image': user.profile_image
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    return jsonify({
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'full_name': user.full_name,
        'is_seller': user.is_seller,
        'balance': user.balance,
        'trust_score': user.trust_score,
        'profile_image': user.profile_image,
        'upi_id': user.upi_id
    })

# ==================== GIG ROUTES ====================

@app.route('/api/gigs', methods=['GET'])
def get_gigs():
    category = request.args.get('category', 'all')
    search = request.args.get('search', '')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 12))
    
    query = Gig.query.filter_by(is_active=True)
    
    if category != 'all':
        query = query.filter_by(category=category)
    
    if search:
        query = query.filter(Gig.title.contains(search) | Gig.description.contains(search))
    
    gigs = query.order_by(Gig.rating.desc()).paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'gigs': [{
            'id': g.id,
            'title': g.title,
            'description': g.description,
            'category': g.category,
            'price': g.price,
            'delivery_days': g.delivery_days,
            'thumbnail': g.thumbnail,
            'rating': g.rating,
            'total_orders': g.total_orders,
            'seller': {
                'id': g.seller.id,
                'username': g.seller.username,
                'profile_image': g.seller.profile_image,
                'trust_score': g.seller.trust_score
            }
        } for g in gigs.items],
        'total': gigs.total,
        'pages': gigs.pages,
        'current_page': page
    })

@app.route('/api/gigs/<int:gig_id>', methods=['GET'])
def get_gig(gig_id):
    gig = Gig.query.get_or_404(gig_id)
    reviews = Review.query.filter_by(gig_id=gig_id).order_by(Review.created_at.desc()).limit(10).all()
    
    return jsonify({
        'id': gig.id,
        'title': gig.title,
        'description': gig.description,
        'category': gig.category,
        'price': gig.price,
        'delivery_days': gig.delivery_days,
        'thumbnail': gig.thumbnail,
        'video_url': gig.video_url,
        'rating': gig.rating,
        'total_orders': gig.total_orders,
        'tags': json.loads(gig.tags) if gig.tags else [],
        'seller': {
            'id': gig.seller.id,
            'username': gig.seller.username,
            'full_name': gig.seller.full_name,
            'profile_image': gig.seller.profile_image,
            'trust_score': gig.seller.trust_score,
            'bio': gig.seller.bio
        },
        'reviews': [{
            'id': r.id,
            'rating': r.rating,
            'comment': r.comment,
            'created_at': r.created_at.isoformat(),
            'reviewer': User.query.get(r.reviewer_id).username
        } for r in reviews]
    })

@app.route('/api/gigs', methods=['POST'])
@jwt_required()
def create_gig():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user.is_seller:
        user.is_seller = True
        db.session.commit()
    
    data = request.json
    
    # Check for plagiarism if thumbnail provided
    if data.get('thumbnail_data'):
        content_hash = calculate_perceptual_hash(base64.b64decode(data['thumbnail_data']))
        is_stolen, original_gig_id = detect_plagiarism(content_hash)
        
        if is_stolen:
            return jsonify({'error': 'Content appears to be plagiarized', 'original_gig_id': original_gig_id}), 400
    
    gig = Gig(
        seller_id=user_id,
        title=data['title'],
        description=data['description'],
        category=data['category'],
        price=float(data['price']),
        delivery_days=int(data.get('delivery_days', 3)),
        thumbnail=data.get('thumbnail'),
        video_url=data.get('video_url'),
        tags=json.dumps(data.get('tags', []))
    )
    
    db.session.add(gig)
    db.session.commit()
    
    # Store content fingerprint
    if data.get('thumbnail_data'):
        fingerprint = ContentFingerprint(
            gig_id=gig.id,
            fingerprint=content_hash
        )
        db.session.add(fingerprint)
        db.session.commit()
    
    return jsonify({'id': gig.id, 'message': 'Gig created successfully'}), 201

@app.route('/api/gigs/<int:gig_id>', methods=['PUT'])
@jwt_required()
def update_gig(gig_id):
    user_id = get_jwt_identity()
    gig = Gig.query.get_or_404(gig_id)
    
    if gig.seller_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    
    gig.title = data.get('title', gig.title)
    gig.description = data.get('description', gig.description)
    gig.price = float(data.get('price', gig.price))
    gig.delivery_days = int(data.get('delivery_days', gig.delivery_days))
    gig.is_active = data.get('is_active', gig.is_active)
    
    db.session.commit()
    
    return jsonify({'message': 'Gig updated successfully'})

# ==================== ORDER & PAYMENT ROUTES ====================

@app.route('/api/orders/create', methods=['POST'])
@jwt_required()
def create_order():
    buyer_id = get_jwt_identity()
    data = request.json
    
    gig = Gig.query.get_or_404(data['gig_id'])
    
    if gig.seller_id == buyer_id:
        return jsonify({'error': 'Cannot order your own gig'}), 400
    
    order = Order(
        buyer_id=buyer_id,
        seller_id=gig.seller_id,
        gig_id=gig.id,
        amount=gig.price,
        buyer_message=data.get('message', '')
    )
    
    db.session.add(order)
    db.session.commit()
    
    return jsonify({
        'order_id': order.id,
        'amount': order.amount,
        'message': 'Order created, proceed to payment'
    }), 201

@app.route('/api/payment/razorpay/create', methods=['POST'])
@jwt_required()
def create_razorpay_payment():
    data = request.json
    order = Order.query.get_or_404(data['order_id'])
    
    try:
        razorpay_order = razorpay_client.order.create({
            'amount': int(order.amount * 100),  # Convert to paise
            'currency': 'INR',
            'payment_capture': 1
        })
        
        return jsonify({
            'razorpay_order_id': razorpay_order['id'],
            'amount': order.amount,
            'currency': 'INR',
            'key_id': RAZORPAY_KEY_ID
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/payment/razorpay/verify', methods=['POST'])
@jwt_required()
def verify_razorpay_payment():
    data = request.json
    order = Order.query.get_or_404(data['order_id'])
    
    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': data['razorpay_order_id'],
            'razorpay_payment_id': data['razorpay_payment_id'],
            'razorpay_signature': data['razorpay_signature']
        })
        
        order.payment_id = data['razorpay_payment_id']
        order.payment_method = 'razorpay'
        order.status = 'in_progress'
        order.escrow_status = 'held'
        
        gig = Gig.query.get(order.gig_id)
        gig.total_orders += 1
        
        db.session.commit()
        
        return jsonify({'message': 'Payment successful', 'order_id': order.id})
    except Exception as e:
        return jsonify({'error': 'Payment verification failed'}), 400

@app.route('/api/payment/upi/create', methods=['POST'])
@jwt_required()
def create_upi_payment():
    """Handle UPI payments"""
    data = request.json
    order = Order.query.get_or_404(data['order_id'])
    
    # Generate UPI payment link or QR code
    upi_id = "merchant@upi"  # Replace with actual merchant UPI
    amount = order.amount
    
    upi_link = f"upi://pay?pa={upi_id}&pn=Vortex&am={amount}&cu=INR&tn=Order{order.id}"
    
    return jsonify({
        'upi_link': upi_link,
        'order_id': order.id,
        'amount': amount,
        'qr_data': upi_link
    })

@app.route('/api/orders/<int:order_id>/complete', methods=['POST'])
@jwt_required()
def complete_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.get_or_404(order_id)
    
    if order.buyer_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Release escrow to seller
    order.status = 'completed'
    order.escrow_status = 'released'
    order.completed_at = datetime.utcnow()
    
    seller = User.query.get(order.seller_id)
    seller.balance += order.amount * 0.85  # 15% platform fee
    
    db.session.commit()
    
    update_gig_rating(order.gig_id)
    update_seller_trust_score(order.seller_id)
    
    return jsonify({'message': 'Order completed, payment released to seller'})

@app.route('/api/orders/<int:order_id>/deliver', methods=['POST'])
@jwt_required()
def deliver_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.get_or_404(order_id)
    
    if order.seller_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    order.delivery_file = data.get('file_url')
    order.seller_message = data.get('message', '')
    
    db.session.commit()
    
    return jsonify({'message': 'Order delivered successfully'})

@app.route('/api/orders/my-orders', methods=['GET'])
@jwt_required()
def get_my_orders():
    user_id = get_jwt_identity()
    role = request.args.get('role', 'buyer')  # buyer or seller
    
    if role == 'buyer':
        orders = Order.query.filter_by(buyer_id=user_id).order_by(Order.created_at.desc()).all()
    else:
        orders = Order.query.filter_by(seller_id=user_id).order_by(Order.created_at.desc()).all()
    
    return jsonify({
        'orders': [{
            'id': o.id,
            'gig_title': Gig.query.get(o.gig_id).title,
            'amount': o.amount,
            'status': o.status,
            'escrow_status': o.escrow_status,
            'created_at': o.created_at.isoformat(),
            'buyer': User.query.get(o.buyer_id).username,
            'seller': User.query.get(o.seller_id).username
        } for o in orders]
    })

# ==================== WITHDRAWAL ROUTES ====================

@app.route('/api/withdrawal/request', methods=['POST'])
@jwt_required()
def request_withdrawal():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.json
    
    amount = float(data['amount'])
    
    if amount > user.balance:
        return jsonify({'error': 'Insufficient balance'}), 400
    
    if amount < 10:
        return jsonify({'error': 'Minimum withdrawal is ₹10'}), 400
    
    withdrawal = Withdrawal(
        user_id=user_id,
        amount=amount,
        method=data['method'],
        upi_id=data.get('upi_id'),
        bank_details=json.dumps(data.get('bank_details', {}))
    )
    
    user.balance -= amount
    
    db.session.add(withdrawal)
    db.session.commit()
    
    return jsonify({'message': 'Withdrawal request submitted', 'withdrawal_id': withdrawal.id}), 201

@app.route('/api/withdrawal/history', methods=['GET'])
@jwt_required()
def withdrawal_history():
    user_id = get_jwt_identity()
    withdrawals = Withdrawal.query.filter_by(user_id=user_id).order_by(Withdrawal.created_at.desc()).all()
    
    return jsonify({
        'withdrawals': [{
            'id': w.id,
            'amount': w.amount,
            'method': w.method,
            'status': w.status,
            'created_at': w.created_at.isoformat()
        } for w in withdrawals]
    })

# ==================== AI TOOLS ROUTES ====================

@app.route('/api/ai/remove-background', methods=['POST'])
def remove_background():
    """AI Background removal"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    img_bytes = file.read()
    
    # Use rembg or similar library for background removal
    # For now, returning placeholder
    return jsonify({'message': 'Background removed', 'processed_image': 'base64_data_here'})

@app.route('/api/ai/detect-plagiarism', methods=['POST'])
def detect_plagiarism_api():
    """Check if content is stolen"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    img_bytes = file.read()
    
    content_hash = calculate_perceptual_hash(img_bytes)
    is_stolen, original_gig_id = detect_plagiarism(content_hash)
    
    if is_stolen:
        original_gig = Gig.query.get(original_gig_id)
        return jsonify({
            'is_plagiarized': True,
            'confidence': 0.95,
            'original_gig': {
                'id': original_gig.id,
                'title': original_gig.title,
                'seller': original_gig.seller.username
            }
        })
    
    return jsonify({'is_plagiarized': False, 'confidence': 0.0})

@app.route('/api/reviews', methods=['POST'])
@jwt_required()
def create_review():
    user_id = get_jwt_identity()
    data = request.json
    
    order = Order.query.get_or_404(data['order_id'])
    
    if order.buyer_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if order.status != 'completed':
        return jsonify({'error': 'Order must be completed first'}), 400
    
    review = Review(
        order_id=order.id,
        gig_id=order.gig_id,
        reviewer_id=user_id,
        rating=float(data['rating']),
        comment=data.get('comment', '')
    )
    
    db.session.add(review)
    db.session.commit()
    
    update_gig_rating(order.gig_id)
    update_seller_trust_score(order.seller_id)
    
    return jsonify({'message': 'Review submitted successfully'}), 201

# ==================== SEARCH ROUTES ====================

@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    category = request.args.get('category', 'all')
    min_price = request.args.get('min_price', 0)
    max_price = request.args.get('max_price', 10000)
    min_rating = request.args.get('min_rating', 0)
    
    gigs_query = Gig.query.filter_by(is_active=True)
    
    if query:
        gigs_query = gigs_query.filter(
            (Gig.title.contains(query)) | 
            (Gig.description.contains(query)) |
            (Gig.tags.contains(query))
        )
    
    if category != 'all':
        gigs_query = gigs_query.filter_by(category=category)
    
    gigs_query = gigs_query.filter(
        Gig.price >= float(min_price),
        Gig.price <= float(max_price),
        Gig.rating >= float(min_rating)
    )
    
    gigs = gigs_query.order_by(Gig.rating.desc(), Gig.total_orders.desc()).all()
    
    return jsonify({
        'results': [{
            'id': g.id,
            'title': g.title,
            'description': g.description[:200],
            'category': g.category,
            'price': g.price,
            'rating': g.rating,
            'thumbnail': g.thumbnail,
            'seller': {
                'username': g.seller.username,
                'trust_score': g.seller.trust_score
            }
        } for g in gigs]
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
