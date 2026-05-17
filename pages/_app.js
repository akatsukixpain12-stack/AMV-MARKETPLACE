import '../styles/globals.css';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../lib/store';
import { getCurrentUser } from '../lib/api';
import Navbar from '../components/Navbar';

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
    <>
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
    </>
  );
}

export default MyApp;
