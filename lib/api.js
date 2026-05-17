import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const googleAuth = (token) => api.post('/auth/google', { token });
export const getCurrentUser = () => api.get('/auth/me');

// Gigs
export const getGigs = (params) => api.get('/gigs', { params });
export const getGig = (id) => api.get(`/gigs/${id}`);
export const createGig = (data) => api.post('/gigs', data);
export const updateGig = (id, data) => api.put(`/gigs/${id}`, data);

// Orders
export const createOrder = (data) => api.post('/orders/create', data);
export const getMyOrders = (role) => api.get('/orders/my-orders', { params: { role } });
export const completeOrder = (id) => api.post(`/orders/${id}/complete`);
export const deliverOrder = (id, data) => api.post(`/orders/${id}/deliver`, data);
export const requestAiVerify = (orderId) => api.post(`/orders/${orderId}/request-ai-verify`);
export const getAiGuardStatus = () => api.get('/ai/guard/status');

// Payment
export const createRazorpayPayment = (orderId) => api.post('/payment/razorpay/create', { order_id: orderId });
export const verifyRazorpayPayment = (data) => api.post('/payment/razorpay/verify', data);
export const createUPIPayment = (orderId) => api.post('/payment/upi/create', { order_id: orderId });

// Withdrawal
export const requestWithdrawal = (data) => api.post('/withdrawal/request', data);
export const getWithdrawalHistory = () => api.get('/withdrawal/history');

// Reviews
export const createReview = (data) => api.post('/reviews', data);

// Search
export const search = (params) => api.get('/search', { params });

// AI Tools
export const removeBackground = (formData) => api.post('/ai/remove-background', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 120000,
});

export const greenScreen = (formData) => api.post('/ai/green-screen', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 120000,
});

export const detectPlagiarism = (formData) => api.post('/ai/detect-plagiarism', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 120000,
});

// Escrow
export const disputeEscrow = (orderId, data) => api.post(`/escrow/${orderId}/dispute`, data);
export const refundEscrow = (orderId) => api.post(`/escrow/${orderId}/refund`);

export const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_UPI || 'https://urpy.link/gkLVl4';

export default api;
