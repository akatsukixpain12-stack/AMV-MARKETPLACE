# VORTEX Marketplace - Complete Project Summary

## 🎯 Project Overview

**VORTEX** is a production-ready, full-stack marketplace platform for video editors to buy and sell editing services (AMVs, gaming montages, TikTok reels, motion graphics). Built with Flask (Python) backend and Next.js (React) frontend.

**GitHub Repository:** https://github.com/akatsukixpain12-stack/AMV-MARKETPLACE

## ✨ Key Features Implemented

### 1. **Complete Authentication System**
- ✅ Email/Password registration and login
- ✅ Google OAuth integration (one-click login)
- ✅ JWT token-based authentication
- ✅ Secure password hashing
- ✅ Session management with Zustand

### 2. **Full Marketplace Functionality**
- ✅ Browse gigs with filters (category, price, rating)
- ✅ Advanced search with multiple parameters
- ✅ Gig creation and management
- ✅ Seller profiles with trust scores
- ✅ Review and rating system
- ✅ Order tracking (buyer and seller views)

### 3. **Escrow Payment System**
- ✅ Funds held in escrow until delivery confirmation
- ✅ Automatic release to seller on completion
- ✅ Refund system for cancelled orders
- ✅ 15% platform fee deduction
- ✅ Transaction history tracking

### 4. **Multiple Payment Options**
- ✅ **Razorpay**: Credit/debit cards, UPI, netbanking, wallets
- ✅ **Direct UPI**: Generate UPI payment links
- ✅ **Stripe**: International payments (optional)
- ✅ **NOT limited to Razorpay** - multiple UPI providers supported

### 5. **Real Money Withdrawal System**
- ✅ Withdraw to UPI ID
- ✅ Withdraw to bank account
- ✅ Minimum withdrawal: ₹10
- ✅ Withdrawal history tracking
- ✅ Status updates (pending, processing, completed)

### 6. **AI-Powered Tools**
- ✅ **Background Remover**: ML-based background removal (browser-based)
- ✅ **Green Screen Tool**: Chroma key with adjustable tolerance and feathering
- ✅ **Stolen Edit Detector**: Perceptual hashing for plagiarism detection
- ✅ **Quality Scorer**: Coming soon

### 7. **Trust & Security**
- ✅ AI-powered trust score for sellers
- ✅ Plagiarism detection before listing
- ✅ Escrow protection for all transactions
- ✅ Review verification
- ✅ On-time delivery tracking

### 8. **User Experience**
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Hamburger Menu**: Clean mobile navigation
- ✅ **Dark Theme**: Modern, eye-friendly UI
- ✅ **Donate Button**: UPI link (https://urpy.link/gkLVl4)
- ✅ **Toast Notifications**: Real-time feedback
- ✅ **Loading States**: Smooth user experience

## 🏗️ Technical Architecture

### Backend (Flask + Python)
```
app.py (Main server file)
├── Authentication Routes
│   ├── /api/auth/register
│   ├── /api/auth/login
│   └── /api/auth/google
├── Gig Routes
│   ├── /api/gigs (GET, POST)
│   └── /api/gigs/<id> (GET, PUT)
├── Order Routes
│   ├── /api/orders/create
│   ├── /api/orders/<id>/complete
│   └── /api/orders/<id>/deliver
├── Payment Routes
│   ├── /api/payment/razorpay/create
│   ├── /api/payment/razorpay/verify
│   └── /api/payment/upi/create
├── Withdrawal Routes
│   ├── /api/withdrawal/request
│   └── /api/withdrawal/history
├── AI Tools Routes
│   ├── /api/ai/remove-background
│   └── /api/ai/detect-plagiarism
└── Search Routes
    └── /api/search
```

### Database Models
- **User**: Authentication, profile, balance, trust score
- **Gig**: Service listings with category, price, ratings
- **Order**: Transaction records with escrow status
- **Review**: Ratings and comments
- **Withdrawal**: Payout requests and history
- **ContentFingerprint**: Plagiarism detection hashes

### Frontend (Next.js + React)
```
pages/
├── index.js          # Homepage with hero, features, CTA
├── login.js          # Login with Google OAuth
├── signup.js         # Registration with Google OAuth
├── marketplace.js    # Browse all gigs
├── gig/[id].js      # Individual gig details
├── dashboard.js      # User dashboard
├── wallet.js         # Wallet & withdrawals
├── orders.js         # Order management
└── ai-tools/         # AI tool pages
    ├── background-remover.js
    └── green-screen.js

components/
└── Navbar.jsx        # Navigation with hamburger menu

lib/
├── api.js            # Axios API client
└── store.js          # Zustand state management
```

## 📦 Dependencies

### Backend (Python)
- Flask - Web framework
- Flask-CORS - Cross-origin requests
- Flask-SQLAlchemy - Database ORM
- Flask-JWT-Extended - JWT authentication
- Pillow - Image processing
- OpenCV - Video processing
- TensorFlow - AI/ML models
- Razorpay - Payment gateway
- Stripe - International payments
- Google Auth - OAuth integration

### Frontend (Node.js)
- Next.js - React framework
- React - UI library
- Axios - HTTP client
- Zustand - State management
- Tailwind CSS - Styling
- Framer Motion - Animations
- React Hot Toast - Notifications
- Lucide React - Icons

## 🚀 Quick Start

### Option 1: Automated (Windows)
```bash
# Install everything
install.bat

# Edit .env with your API keys

# Run both servers
run.bat
```

### Option 2: Manual
```bash
# Backend
pip install -r requirements.txt
python app.py

# Frontend (new terminal)
npm install
npm run dev
```

Visit: http://localhost:3000

## 🔑 Required API Keys

1. **Google OAuth** (for Google login)
   - Get from: https://console.cloud.google.com/

2. **Razorpay** (for payments)
   - Get from: https://razorpay.com/

3. **Secret Keys** (generate random strings)
   - Use: `python -c "import secrets; print(secrets.token_hex(32))"`

See `SETUP.md` for detailed instructions.

## 💰 Revenue Model

### Platform Fees
- **15% commission** on each completed order
- Deducted automatically when escrow is released
- Transparent fee structure

### Example Transaction
- Gig Price: ₹100
- Platform Fee: ₹15 (15%)
- Seller Receives: ₹85

## 🔒 Security Features

1. **Authentication**
   - JWT tokens with expiration
   - Password hashing (werkzeug)
   - Google OAuth 2.0

2. **Payments**
   - Escrow system (funds held until delivery)
   - Payment gateway integration (PCI compliant)
   - Transaction verification

3. **Data Protection**
   - SQL injection prevention (SQLAlchemy ORM)
   - CORS configuration
   - Input validation
   - XSS protection

4. **Content Protection**
   - Plagiarism detection
   - Content fingerprinting
   - Watermarking support

## 📊 Database Schema

```sql
User
├── id (Primary Key)
├── email (Unique)
├── username (Unique)
├── password_hash
├── google_id (Unique, Optional)
├── balance (Float)
├── trust_score (Float)
├── upi_id
└── bank_account

Gig
├── id (Primary Key)
├── seller_id (Foreign Key → User)
├── title
├── description
├── category
├── price
├── rating
├── content_hash (For plagiarism detection)
└── is_active

Order
├── id (Primary Key)
├── buyer_id (Foreign Key → User)
├── seller_id (Foreign Key → User)
├── gig_id (Foreign Key → Gig)
├── amount
├── status (pending, in_progress, completed, cancelled)
├── escrow_status (held, released, refunded)
└── payment_id

Review
├── id (Primary Key)
├── order_id (Foreign Key → Order)
├── gig_id (Foreign Key → Gig)
├── reviewer_id (Foreign Key → User)
├── rating (1-5)
└── comment

Withdrawal
├── id (Primary Key)
├── user_id (Foreign Key → User)
├── amount
├── method (upi, bank_transfer)
├── status (pending, processing, completed, failed)
└── transaction_id
```

## 🎨 Design System

### Colors
- Background: `#080808`
- Surface: `#0f0f0f`
- Card: `#131313`
- Border: `rgba(255,255,255,0.07)`
- Text: `#f2f2f2`
- Accent: Purple/Pink gradient

### Typography
- Display: Bebas Neue (headings)
- Body: DM Sans (content)

### Components
- Rounded corners: 8-20px
- Shadows: Subtle, layered
- Animations: Smooth, 200-300ms
- Hover states: Scale, color, shadow

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration
- [ ] Google login
- [ ] Create gig
- [ ] Browse marketplace
- [ ] Place order
- [ ] Make payment (test mode)
- [ ] Deliver order
- [ ] Complete order
- [ ] Leave review
- [ ] Request withdrawal
- [ ] Use AI tools

### Test Payment Cards (Razorpay Test Mode)
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## 🚀 Deployment Options

### Backend
- Heroku
- Railway
- Render
- PythonAnywhere
- AWS EC2
- DigitalOcean

### Frontend
- Vercel (recommended)
- Netlify
- AWS Amplify
- Cloudflare Pages

### Database
- PostgreSQL (production)
- MySQL
- MongoDB

## 📈 Future Enhancements

### Phase 2
- [ ] Video upload & streaming
- [ ] Real-time chat
- [ ] Push notifications
- [ ] Email notifications
- [ ] Advanced analytics

### Phase 3
- [ ] Mobile apps (React Native)
- [ ] Subscription plans
- [ ] Affiliate program
- [ ] API for third-party integrations

### Phase 4
- [ ] AI video editing tools
- [ ] Automated quality checking
- [ ] Smart recommendations
- [ ] Multi-language support

## 📞 Support & Contact

- **GitHub**: https://github.com/akatsukixpain12-stack/AMV-MARKETPLACE
- **Issues**: https://github.com/akatsukixpain12-stack/AMV-MARKETPLACE/issues
- **Donate**: https://urpy.link/gkLVl4

## 📄 License

MIT License - Free to use, modify, and distribute.

## 🙏 Acknowledgments

- Flask & Next.js communities
- Razorpay for payment integration
- Google for OAuth services
- Open source contributors

---

**Built with ❤️ for the creator economy**

Last Updated: May 17, 2026
Version: 1.0.0
