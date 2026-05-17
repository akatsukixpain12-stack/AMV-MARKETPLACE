import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { register, googleAuth } from '../lib/api';
import { useAuthStore } from '../lib/store';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

export default function Signup() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await register(formData);
      setAuth(res.data.user, res.data.token);
      localStorage.setItem('token', res.data.token);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleAuth(credentialResponse.credential);
      setAuth(res.data.user, res.data.token);
      localStorage.setItem('token', res.data.token);
      toast.success('Welcome!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Google signup failed');
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - VORTEX</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-900/20 via-black to-black">
        <div className="w-full max-w-md">
          <Link href="/" className="text-display text-4xl block text-center mb-8">
            VORTEX
          </Link>

          <div className="bg-[#131313] border border-white/10 rounded-2xl p-8">
            <h1 className="text-2xl font-bold mb-2">Create Account</h1>
            <p className="text-white/60 text-sm mb-8">Join the marketplace</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 focus:border-white/30 outline-none transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 focus:border-white/30 outline-none transition"
                  placeholder="johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 focus:border-white/30 outline-none transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 focus:border-white/30 outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 focus:border-white/30 outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-sm text-white/50">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google signup failed')}
                theme="filled_black"
                size="large"
                text="signup_with"
                shape="rectangular"
              />
            </div>

            <p className="text-center text-sm text-white/60 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-white hover:text-white/80 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
