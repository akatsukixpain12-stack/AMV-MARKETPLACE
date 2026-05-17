import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { login, googleAuth } from '../lib/api';
import { useAuthStore } from '../lib/store';
import GoogleAuthButton from '../components/GoogleAuthButton';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login({ email, password });
      setAuth(res.data.user, res.data.token);
      toast.success('Welcome back!');
      
      // Check if user has selected a role
      if (!res.data.user.account_type) {
        router.push('/select-role');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse?.credential;
      if (!token) {
        toast.error('Google login did not return a token');
        return;
      }
      const res = await googleAuth(token);
      setAuth(res.data.user, res.data.token);
      toast.success('Signed in with Google');
      router.push(res.data.user.account_type ? '/dashboard' : '/select-role');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-display text-5xl mb-3">LOGIN</h1>
          <p className="text-white/60">Welcome back to Vortex</p>
        </div>

        <div className="bg-card border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm text-white/60 mb-2">Email or Username</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 focus:border-white/30 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 focus:border-white/30 outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-white/30">
            <div className="h-px flex-1 bg-white/10" />
            <span>OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <GoogleAuthButton mode="signin" onSuccess={handleGoogleLogin} />

          <p className="text-center text-sm text-white/60 mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-white hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
