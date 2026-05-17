# VORTEX - AI Marketplace for Video Editors

A full-stack marketplace platform for buying and selling video edits (AMVs, montages, motion graphics) with built-in AI tools, escrow payments, and plagiarism detection.

## 🚀 Features

### Core Marketplace
- **Buy & Sell Edits**: Complete marketplace for AMVs, gaming montages, TikTok reels, and motion graphics
- **Google OAuth**: Seamless login/signup with Google
- **User Profiles**: Seller profiles with trust scores and portfolios
- **Advanced Search**: Filter by category, price, rating, and keywords
- **Reviews & Ratings**: Transparent feedback system

### Payment System
- **Multiple Payment Options**: Razorpay, UPI, Stripe support
- **Escrow System**: Funds held until buyer confirms delivery
- **Real Withdrawals**: Sellers can withdraw to UPI or bank account
- **Platform Fee**: Automatic 15% commission handling

### AI Tools (Browser-Based)
- **Background Remover**: ML-powered background removal
- **Green/Blue Screen**: Chroma key tool with adjustable tolerance
- **Plagiarism Detector**: Perceptual hash-based content fingerprinting
- **Quality Scorer**: Coming soon

### Security & Trust
- **AI Trust Score**: Sellers rated on delivery time and reviews
- **Content Fingerprinting**: Prevents stolen edit uploads
- **Secure Escrow**: Buyer protection on all transactions
- **Quality Gates**: Automated quality checks

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework
- **Tailwind CSS**: Styling
- **Zustand**: State management
- **Axios**: API client
- **React Hot Toast**: Notifications
- **Lucide React**: Icons

### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: ORM
- **JWT**: Authentication
- **Razorpay/Stripe**: Payment processing
- **Google OAuth**: Social login
- **OpenCV/Pillow**: Image processing

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
- pip

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/akatsukixpain12-stack/AMV-MARKETPLACE.git
cd AMV-MARKETPLACE
```

2. **Install Frontend Dependencies**
```bash
npm install
```

3. **Install Backend Dependencies**
```bash
pip install -r requirements.txt
```

4. **Environment Variables**
Create `.env` file:
```env
# Flask
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=sqlite:///vortex.db

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Payments
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_RAZORPAY_KEY=your-razorpay-key
NEXT_PUBLIC_DONATE_UPI=https://urpy.link/gkLVl4
```

5. **Run Backend Server**
```bash
python app.py
```

6. **Run Frontend (in another terminal)**
```bash
npm run dev
```

7. **Open Browser**
Navigate to `http://localhost:3000`

## 🎯 Usage

### For Buyers
1. Sign up with Google or email
2. Browse marketplace or search for edits
3. Order a gig
4. Pay via Razorpay/UPI (funds held in escrow)
5. Receive delivery
6. Confirm completion (releases payment to seller)
7. Leave a review

### For Sellers
1. Sign up and create profile
2. Create gig with title, description, price
3. Upload portfolio samples
4. Receive orders
5. Deliver work
6. Get paid (85% after platform fee)
7. Withdraw to UPI/bank

### AI Tools
- Access from navbar "AI Tools"
- All tools run in browser (no upload to server)
- Free forever

## 🔐 Security

- JWT-based authentication
- Password hashing with Werkzeug
- CORS protection
- SQL injection prevention via ORM
- XSS protection
- Escrow system for all transactions
- Content fingerprinting for plagiarism

## 📱 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/otp/request` - Generate phone OTP for signup
- `POST /api/auth/otp/verify` - Verify phone OTP
- `GET /api/auth/me` - Get current user

### Gigs
- `GET /api/gigs` - List gigs
- `GET /api/gigs/:id` - Get gig details
- `POST /api/gigs` - Create gig (auth required)
- `PUT /api/gigs/:id` - Update gig (auth required)

### Orders
- `POST /api/orders/create` - Create order (auth required)
- `GET /api/orders/my-orders` - Get user orders (auth required)
- `POST /api/orders/:id/complete` - Complete order (auth required)
- `POST /api/orders/:id/deliver` - Deliver order (auth required)

### Payments
- `POST /api/payment/razorpay/create` - Create Razorpay order
- `POST /api/payment/razorpay/verify` - Verify payment
- `POST /api/payment/upi/create` - Create UPI payment

### Withdrawals
- `POST /api/withdrawal/request` - Request withdrawal (auth required)
- `GET /api/withdrawal/history` - Get withdrawal history (auth required)

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📄 License

MIT License

## 💖 Donate

Support the project: [Donate via UPI](https://urpy.link/gkLVl4)

## 📧 Contact

For support or inquiries, open an issue on GitHub.

## Render Deployment

This repo now includes [`render.yaml`](./render.yaml) for a two-service Render setup:

- `vortex-backend`: Flask API via `gunicorn app:app`
- `vortex-frontend`: Next.js app via `npm run build` and `npm run start`

### GitHub to Render

1. Push this repo to GitHub.
2. In Render, choose `New +` → `Blueprint` and select the repository.
3. Render will read `render.yaml` and create both services.
4. Set all required environment variables in Render before the first deploy.
5. Turn on auto deploy from the repo branch you want to use.

### Required Render Environment Variables

Backend:
- `SECRET_KEY`
- `JWT_SECRET_KEY`
- `DATABASE_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `STRIPE_SECRET_KEY`
- `PLATFORM_UPI_ID`

Frontend:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_RAZORPAY_KEY`
- `NEXT_PUBLIC_DONATE_UPI`

### Google OAuth Setup

Use the same client id for:
- backend `GOOGLE_CLIENT_ID`
- frontend `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

In Google Cloud Console, add the exact frontend URL Render gives you as an authorized JavaScript origin. If you later use a custom domain, add that too.

### Razorpay Setup

Use:
- backend `RAZORPAY_KEY_ID`
- backend `RAZORPAY_KEY_SECRET`
- frontend `NEXT_PUBLIC_RAZORPAY_KEY`

Frontend key must match the backend account, or payment creation and verification will fail.

## GitHub Terminal Workflow

Use these commands from the project root:

```bash
git init
git add .
git commit -m "Initial deploy-ready setup"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

For later deploys:

```bash
git add .
git commit -m "Update auth and deployment"
git push
```

With Render auto-deploy enabled, each push to GitHub triggers a new deployment automatically.

---

Built with ❤️ by the Vortex Team
