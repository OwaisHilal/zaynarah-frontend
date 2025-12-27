// src/features/checkout/services/useCheckoutApi.js

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const normalizeError = (err) =>
  err?.response?.data?.message ||
  err?.response?.data ||
  err?.message ||
  'Network error';

/* =========================
   CHECKOUT SESSION (NEW)
========================= */

export async function initCheckoutSessionAPI() {
  try {
    // 🔴 FIX: send empty object so Zod passes
    const res = await api.post('/orders/checkout/session/init', {});
    return res.data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function finalizePricingAPI(payload) {
  try {
    const res = await api.post(
      '/orders/checkout/session/finalize-pricing',
      payload
    );
    return res.data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

/* =========================
   LEGACY (KEEP FOR NOW)
========================= */

export async function placeOrderAPI(payload) {
  try {
    const res = await api.post('/orders/create', payload);
    return res.data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

/* =========================
   PAYMENTS
========================= */

export async function createStripeSessionAPI(orderId) {
  try {
    const res = await api.post('/payments/stripe-session', { orderId });
    return {
      sessionId: res.data?.sessionId || res.data?.id,
      publishableKey: res.data?.publishableKey,
    };
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function createRazorpayOrderAPI(orderId) {
  try {
    const res = await api.post('/payments/razorpay-order', { orderId });
    return res.data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

/* =========================
   SHIPPING
========================= */

export async function getShippingMethods(address) {
  try {
    const res = await api.post('/shipping/methods', { address });
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

/* =========================
   ORDERS
========================= */

export async function getOrderAPI(orderId) {
  try {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}
