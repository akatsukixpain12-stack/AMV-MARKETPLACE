import '../styles/globals.css';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../lib/store';
import { getCurrentUser } from '../lib/api';

function MyApp({ Component, pageProps }) {
  const { token, setAuth, logout } = useAuthStore();

  useEffect(() => {
    if (token) {
      getCurrentUser()
        .then((res) => setAuth(res.data, token))
        .catch(() => logout());
    }
  }, []);

  return (
    <>
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
    </>
  );
}

export default MyApp;
