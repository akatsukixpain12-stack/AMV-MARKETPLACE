# VORTEX - AI Marketplace for Video Editors

A production-ready marketplace platform for buying and selling video edits (AMVs, gaming montages, TikTok reels, motion graphics) with built-in AI tools and escrow payment system.

## 🚀 Features

### Core Marketplace
- **Buy & Sell Gigs**: Full marketplace for video editing services
- **Escrow System**: Secure payment holding until delivery confirmation
- **Real Money Withdrawals**: UPI and bank transfer support
- **Trust Score System**: AI-powered seller reputation scoring
- **Advanced Search**: Filter by category, price, rating, and keywords

### Authentication
- **Email/Password Registration**: Traditional signup
- **Google OAuth**: One-click login with Google
- **JWT Authentication**: Secure token-based auth

### Payment Integration
- **Razorpay**: Credit/debit cards, UPI, netbanking
- **UPI Direct**: Generate UPI payment links
- **Stripe**: International payments (optional)
- **Multiple UPI Options**: Not limited to Razorpay

### AI Tools (Browser-Based)
- **Background Remover**: ML-powered background removal
- **Green Screen Tool**: Chroma key with adjustable tolerance
- **Stolen Edit Detector**: Perceptual hashing for plagiarism detection
- **Quality Scorer**: Coming soon

### User Features
- **Wallet System**: Track earnings and balance
- **Withdrawal Requests**: Request payouts to UPI or bank
- **Order Management**: Track orders as buyer and seller
- **Review System**: Rate and review completed orders
- **Profile Management**: Update profile, bio, payment details

### UI/UX
- **Responsive Design**: Mobile-first approach
- **Hamburger Menu**: Mobile navigation
- **Dark Theme**: Modern dark UI
- **Donate Button**: Support via UPI link (https://urpy.link/gkLVl4)

## 📁 Project Structure

```
vortex-marketplace/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS config
├── pages/                # Next.js pages
│   ├── index.js         # Homepage
│   ├── login.js         # Login page
│   ├── signup.js        # Signup page
│   ├── marketplace.js   # Gigs listing
│   ├── dashboard.js     # User dashboard
│   └── wallet.js        # Wallet & withdrawals
├── components/           # React components
│   ├── Navbar.jsx       # Navigation with hamburger menu
│   └── ...
├── lib/                  # Utilities
│   ├── api.js           # API client
│   └── store.js         # State management
├── styles/              # CSS files
│   └── globals.css      # Global styles
└── public/              # Static assets
```

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- pip
- npm or yarn

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

4. Initialize database:
```bash
python app.py
```

The Flask server will run on `http://localhost:5000`

### Frontend Setup

1. Install Node dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

The Next.js app will run on `http://localhost:3000`

## 🔑 API Keys Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy Client ID to `.env`

### Razorpay
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get API keys from Dashboard
3. Add to `.env` file

## 🚀 Deployment

### Backend (Flask)
```bash
gunicorn app:app --bind 0.0.0.0:5000
```

### Frontend (Next.js)
```bash
npm run build
npm start
```

## 📝 Environment Variables

```env
# Backend
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=sqlite:///vortex.db
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_RAZORPAY_KEY=your-razorpay-key-id
NEXT_PUBLIC_DONATE_UPI=https://urpy.link/gkLVl4
```

## 🎯 Key Features Implementation

### Escrow System
- Funds held in escrow when order is placed
- Released to seller when buyer confirms delivery
- Automatic refund if order is cancelled
- 15% platform fee deducted on release

### Withdrawal System
- Minimum withdrawal: ₹10
- Methods: UPI, Bank Transfer
- Processing time: 1-3 business days
- Transaction history tracking

### AI Plagiarism Detection
- Perceptual hashing algorithm
- Compares against all existing gigs
- Hamming distance threshold: 5
- Blocks listing if match found

### Trust Score Calculation
- Based on: Average rating (60%) + On-time delivery (40%)
- Updated after each completed order
- Displayed on seller profile
- Affects search ranking

## 🔒 Security Features

- JWT token authentication
- Password hashing with werkzeug
- SQL injection protection (SQLAlchemy ORM)
- CORS configuration
- Input validation
- Secure payment processing

## 📱 Mobile Responsive

- Hamburger menu for mobile
- Touch-friendly UI elements
- Optimized images
- Responsive grid layouts

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 💖 Support

Donate via UPI: [https://urpy.link/gkLVl4](https://urpy.link/gkLVl4)

## 📧 Contact

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for the creator economy
