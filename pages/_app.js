import '../styles/globals.css';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthStore } from '../lib/store';
import { getCurrentUser } from '../lib/api';
import Navbar from '../components/Navbar';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '000000000000-00000000000000000000000.apps.googleusercontent.com';

function MyApp({ Component, pageProps }) {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser()
        .then(res => setAuth(res.data, token))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#131313',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
    </GoogleOAuthProvider>
  );
}

export default MyApp;
