import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const GoogleLogin = dynamic(
  () => import('@react-oauth/google').then((mod) => mod.GoogleLogin),
  { ssr: false }
);

export default function GoogleAuthButton({ mode = 'signin', onSuccess }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <p className="text-center text-xs text-white/40">
        Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env for Google login
      </p>
    );
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => toast.error('Google login failed')}
        theme="filled_black"
        size="large"
        text={mode === 'signup' ? 'signup_with' : 'signin_with'}
        shape="rectangular"
      />
    </div>
  );
}
