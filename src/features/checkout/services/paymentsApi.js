// src/features/checkout/services/paymentsApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const PAYMENTS_URL = `${API_BASE}/payments`;

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createStripeSession = async (orderId) => {
  try {
    const res = await axios.post(
      `${PAYMENTS_URL}/stripe-session`,
      { orderId },
      { headers: authHeader() }
    );
    return res.data;
  } catch (err) {
    console.error('Stripe Session Error:', err);
    throw err;
  }
};

export const createRazorpayOrder = async (orderId) => {
  try {
    const res = await axios.post(
      `${PAYMENTS_URL}/razorpay-order`,
      { orderId },
      { headers: authHeader() }
    );
    return res.data;
  } catch (err) {
    console.error('Razorpay Create Error:', err);
    throw err;
  }
};

export const verifyRazorpayPayment = async (payload) => {
  try {
    const res = await axios.post(`${PAYMENTS_URL}/razorpay-verify`, payload, {
      headers: authHeader(),
    });
    return res.data;
  } catch (err) {
    console.error('Razorpay Verify Error:', err);
    throw err;
  }
};
