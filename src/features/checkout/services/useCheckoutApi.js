//src/features/checkout/services/useCheckoutApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function normalizeError(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    'Network error'
  );
}

function normalizeStripeResponse(data) {
  return {
    sessionId: data?.sessionId || data?.id || data?.checkoutSessionId || null,
    publishableKey:
      data?.publishableKey ||
      data?.publishable_key ||
      data?.publishable ||
      null,
  };
}

function normalizeRazorpayResponse(data) {
  return {
    orderId: data?.orderId || data?.id || data?.order_id || null,
    key: data?.key || data?.keyId || data?.key_id || null,
    amount: data?.amount || null,
    currency: data?.currency || 'INR',
  };
}

export async function placeOrderAPI(payload) {
  try {
    const res = await api.post('/orders/create', payload);
    return res.data;
  } catch (err) {
    console.error('❌ placeOrderAPI failed:', normalizeError(err));
    throw new Error(normalizeError(err));
  }
}

export async function createStripeSessionAPI(orderId) {
  try {
    const res = await api.post('/payments/stripe-session', { orderId });
    return normalizeStripeResponse(res.data);
  } catch (err) {
    console.error('❌ createStripeSessionAPI failed:', normalizeError(err));
    throw new Error(normalizeError(err));
  }
}

export async function createRazorpayOrderAPI(orderId) {
  try {
    const res = await api.post('/payments/razorpay-order', { orderId });
    return normalizeRazorpayResponse(res.data);
  } catch (err) {
    console.error('❌ createRazorpayOrderAPI failed:', normalizeError(err));
    throw new Error(normalizeError(err));
  }
}

export async function verifyRazorpayPaymentAPI(payload) {
  try {
    const res = await api.post('/payments/razorpay-verify', payload);
    return res.data;
  } catch (err) {
    console.error('❌ verifyRazorpayPaymentAPI failed:', normalizeError(err));
    throw new Error(normalizeError(err));
  }
}

export async function getShippingMethods(address) {
  try {
    const res = await api.post('/shipping/methods', { address });
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('❌ getShippingMethods failed:', normalizeError(err));
    throw new Error(normalizeError(err));
  }
}

export async function getOrderAPI(orderId) {
  try {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}
