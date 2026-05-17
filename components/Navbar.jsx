import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../lib/store';
import { Menu, X, Search, User, LogOut, Wallet, Heart } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 bg-black/95 backdrop-blur-xl border-b border-white/10">
      {/* Logo */}
      <Link href="/" className="text-display text-2xl md:text-3xl tracking-widest">
        VORTEX
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/marketplace" className="text-sm text-white/60 hover:text-white transition">
          Marketplace
        </Link>
        <Link href="/ai-tools" className="text-sm text-white/60 hover:text-white transition">
          AI Tools
        </Link>
        <Link href="/how-it-works" className="text-sm text-white/60 hover:text-white transition">
          How It Works
        </Link>
        <a 
          href={process.env.NEXT_PUBLIC_DONATE_UPI} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold hover:scale-105 transition"
        >
          <Heart className="w-4 h-4" />
          Donate
        </a>
      </div>

      {/* Auth Buttons */}
      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition"
            >
              {user?.profile_image ? (
                <img src={user.profile_image} alt={user.username} className="w-6 h-6 rounded-full" />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="text-sm">{user?.username}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#131313] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <p className="text-sm font-semibold">{user?.full_name || user?.username}</p>
                  <p className="text-xs text-white/50">{user?.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold">₹{user?.balance?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <Link href="/dashboard" className="block px-4 py-3 text-sm hover:bg-white/5 transition">
                  Dashboard
                </Link>
                <Link href="/my-gigs" className="block px-4 py-3 text-sm hover:bg-white/5 transition">
                  My Gigs
                </Link>
                <Link href="/orders" className="block px-4 py-3 text-sm hover:bg-white/5 transition">
                  Orders
                </Link>
                <Link href="/wallet" className="block px-4 py-3 text-sm hover:bg-white/5 transition">
                  Wallet & Withdrawals
                </Link>
                <Link href="/settings" className="block px-4 py-3 text-sm hover:bg-white/5 transition">
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="px-5 py-2 rounded-lg border border-white/20 text-sm hover:bg-white/5 transition">
              Login
            </Link>
            <Link href="/signup" className="px-5 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition">
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-white/5 transition"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black/98 backdrop-blur-xl border-b border-white/10 md:hidden">
          <div className="flex flex-col p-6 space-y-4">
            <Link href="/marketplace" className="text-sm hover:text-white/60 transition">
              Marketplace
            </Link>
            <Link href="/ai-tools" className="text-sm hover:text-white/60 transition">
              AI Tools
            </Link>
            <Link href="/how-it-works" className="text-sm hover:text-white/60 transition">
              How It Works
            </Link>
            <a 
              href={process.env.NEXT_PUBLIC_DONATE_UPI} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold w-fit"
            >
              <Heart className="w-4 h-4" />
              Donate
            </a>
            
            {isAuthenticated ? (
              <>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm font-semibold mb-2">{user?.username}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <Wallet className="w-4 h-4 text-green-400" />
                    <span className="text-sm">₹{user?.balance?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <Link href="/dashboard" className="text-sm hover:text-white/60 transition">
                  Dashboard
                </Link>
                <Link href="/orders" className="text-sm hover:text-white/60 transition">
                  Orders
                </Link>
                <Link href="/wallet" className="text-sm hover:text-white/60 transition">
                  Wallet
                </Link>
                <button onClick={logout} className="text-sm text-red-400 text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2 rounded-lg border border-white/20 text-sm text-center">
                  Login
                </Link>
                <Link href="/signup" className="px-5 py-2 rounded-lg bg-white text-black text-sm font-semibold text-center">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
