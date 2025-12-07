// src/features/checkout/services/paymentsApi.js
import axios from 'axios';

export const createStripeSession = async (orderId) => {
  const res = await axios.post('/api/payments/stripe/checkout-session', {
    orderId,
  });
  return res.data;
};

export const createRazorpayOrder = async (orderId) => {
  const res = await axios.post('/api/payments/razorpay/order', { orderId });
  return res.data;
};

export const verifyRazorpayPayment = async ({
  orderId,
  paymentId,
  signature,
}) => {
  const res = await axios.post('/api/payments/razorpay/verify', {
    orderId,
    paymentId,
    signature,
  });
  return res.data;
};
