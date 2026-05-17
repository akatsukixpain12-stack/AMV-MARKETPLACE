import Link from 'next/link';
import { UserPlus, Search, ShoppingCart, Package, DollarSign, Star } from 'lucide-react';

export default function HowItWorks() {
  const buyerSteps = [
    {
      icon: UserPlus,
      title: 'Sign Up',
      description: 'Create your free account in seconds with email or Google',
    },
    {
      icon: Search,
      title: 'Browse & Search',
      description: 'Find the perfect editor by category, price, or rating',
    },
    {
      icon: ShoppingCart,
      title: 'Place Order',
      description: 'Choose your gig and pay securely with Razorpay or UPI',
    },
    {
      icon: Package,
      title: 'Receive Delivery',
      description: 'Get your edit delivered within the specified timeframe',
    },
    {
      icon: Star,
      title: 'Leave Review',
      description: 'Rate your experience and help the community',
    },
  ];

  const sellerSteps = [
    {
      icon: UserPlus,
      title: 'Create Account',
      description: 'Sign up and set up your seller profile',
    },
    {
      icon: Package,
      title: 'Create Gig',
      description: 'List your editing services with pricing and samples',
    },
    {
      icon: ShoppingCart,
      title: 'Receive Orders',
      description: 'Get notified when buyers order your gigs',
    },
    {
      icon: Package,
      title: 'Deliver Work',
      description: 'Upload your completed edit for buyer review',
    },
    {
      icon: DollarSign,
      title: 'Get Paid',
      description: 'Withdraw earnings to your UPI or bank account',
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-white pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-display text-6xl md:text-8xl mb-6">HOW IT WORKS</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Simple, secure, and transparent. Start buying or selling edits in minutes.
          </p>
        </div>

        {/* For Buyers */}
        <div className="mb-20">
          <h2 className="text-display text-4xl md:text-6xl mb-12 text-center">FOR BUYERS</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {buyerSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10" />
                  </div>
                  <div className="text-display text-6xl text-white/10 mb-4">{index + 1}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-white/60">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* For Sellers */}
        <div className="mb-20">
          <h2 className="text-display text-4xl md:text-6xl mb-12 text-center">FOR SELLERS</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {sellerSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10" />
                  </div>
                  <div className="text-display text-6xl text-white/10 mb-4">{index + 1}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-white/60">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="bg-card border border-white/10 rounded-2xl p-12 mb-12">
          <h2 className="text-display text-4xl mb-8 text-center">WHY VORTEX?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">🔒 Secure Escrow</h3>
              <p className="text-white/60">Your money is held safely until you confirm delivery. No scams, no risks.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">🤖 AI Protection</h3>
              <p className="text-white/60">Plagiarism detection and quality checks ensure authentic, high-quality work.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">⚡ Fast Payouts</h3>
              <p className="text-white/60">Sellers get paid instantly to UPI or bank. No waiting, no hassle.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-display text-5xl mb-6">READY TO START?</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg hover:scale-105 transition">
              Sign Up Free
            </Link>
            <Link href="/marketplace" className="px-8 py-4 rounded-xl border border-white/20 text-lg hover:bg-white/5 transition">
              Browse Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
