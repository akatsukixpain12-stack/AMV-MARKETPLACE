# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Clone the Repository
```bash
git clone https://github.com/akatsukixpain12-stack/AMV-MARKETPLACE.git
cd AMV-MARKETPLACE
```

### Step 2: Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env

# Edit .env and add your API keys
# (See API Keys section below)

# Run Flask server
python app.py
```

Backend will run on: `http://localhost:5000`

### Step 3: Frontend Setup
```bash
# Install Node dependencies
npm install

# Run Next.js development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 🔑 Required API Keys

### 1. Google OAuth (Required for Google Login)
1. Go to: https://console.cloud.google.com/
2. Create new project
3. Enable "Google+ API"
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000`
6. Copy Client ID to `.env`:
```
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

### 2. Razorpay (Required for Payments)
1. Sign up at: https://razorpay.com/
2. Go to Dashboard → Settings → API Keys
3. Generate Test/Live keys
4. Add to `.env`:
```
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxx
```

### 3. Secret Keys (Generate Random Strings)
```bash
# Generate random secret keys
python -c "import secrets; print(secrets.token_hex(32))"
```

Add to `.env`:
```
SECRET_KEY=your-generated-secret-key
JWT_SECRET_KEY=your-generated-jwt-secret
```

## 📁 Project Structure

```
AMV-MARKETPLACE/
├── app.py                    # Flask backend (API server)
├── requirements.txt          # Python dependencies
├── package.json             # Node.js dependencies
├── .env                     # Environment variables (create this)
├── .env.example             # Example environment file
├── README.md                # Full documentation
├── SETUP.md                 # This file
│
├── pages/                   # Next.js pages
│   ├── index.js            # Homepage
│   ├── login.js            # Login page
│   ├── signup.js           # Signup page
│   ├── marketplace.js      # Browse gigs
│   ├── dashboard.js        # User dashboard
│   └── wallet.js           # Wallet & withdrawals
│
├── components/              # React components
│   └── Navbar.jsx          # Navigation with hamburger menu
│
├── lib/                     # Utilities
│   ├── api.js              # API client
│   └── store.js            # State management (Zustand)
│
├── styles/                  # CSS files
│   └── globals.css         # Global styles
│
└── public/                  # Static assets
```

## 🎯 Features Checklist

### ✅ Implemented
- [x] User registration & login
- [x] Google OAuth authentication
- [x] Marketplace with gig listings
- [x] Escrow payment system
- [x] Razorpay integration
- [x] UPI payment support
- [x] Real money withdrawals (UPI/Bank)
- [x] Order management
- [x] Review system
- [x] Trust score calculation
- [x] Wallet system
- [x] Background remover AI tool
- [x] Green screen tool
- [x] Plagiarism detection (perceptual hashing)
- [x] Responsive design
- [x] Hamburger menu
- [x] Donate button (UPI link)
- [x] Advanced search & filters

### 🚧 Coming Soon
- [ ] Video upload & streaming
- [ ] Real-time chat
- [ ] Notifications
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Email notifications

## 🧪 Testing

### Test User Accounts
After running the app, you can create test accounts or use:

**Email/Password:**
- Email: test@example.com
- Password: test123

**Google OAuth:**
- Use any Google account

### Test Payments (Razorpay Test Mode)
Use these test card details:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (Flask)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000 (Next.js)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Issues
```bash
# Delete and recreate database
del vortex.db
python app.py
```

### Module Not Found
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
npm install --force
```

### CORS Errors
Make sure Flask backend is running on port 5000 and Next.js on port 3000.

## 📱 Mobile Testing

The app is fully responsive. Test on:
- Chrome DevTools (F12 → Toggle device toolbar)
- Real mobile device (use your local IP)
- Browser mobile emulators

## 🚀 Deployment

### Backend (Flask)
```bash
# Using Gunicorn
gunicorn app:app --bind 0.0.0.0:5000

# Or use platforms like:
# - Heroku
# - Railway
# - Render
# - PythonAnywhere
```

### Frontend (Next.js)
```bash
# Build for production
npm run build
npm start

# Or deploy to:
# - Vercel (recommended)
# - Netlify
# - AWS Amplify
```

### Database
For production, replace SQLite with PostgreSQL:
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

## 💡 Tips

1. **Development**: Run both servers simultaneously (Flask + Next.js)
2. **API Keys**: Never commit `.env` file to git
3. **Testing**: Use Razorpay test mode before going live
4. **Security**: Change all secret keys in production
5. **Backup**: Regularly backup your database

## 📞 Support

- GitHub Issues: https://github.com/akatsukixpain12-stack/AMV-MARKETPLACE/issues
- Donate: https://urpy.link/gkLVl4

## 🎉 You're Ready!

Visit `http://localhost:3000` and start building your marketplace!
