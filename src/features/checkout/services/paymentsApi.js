// src/features/checkout/services/paymentsApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const createStripeSession = async (orderId) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    `${API_BASE}/payments/stripe-session`,
    { orderId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const createRazorpayOrder = async (orderId) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    `${API_BASE}/payments/razorpay-order`,
    { orderId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const verifyRazorpayPayment = async (payload) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    `${API_BASE}/payments/razorpay-verify`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
