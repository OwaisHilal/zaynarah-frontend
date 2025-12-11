// src/features/checkout/hooks/useCheckoutApi.js
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------
// API BASE CONFIG
// ----------------------------------------------------
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const ORDERS_URL = `${API_BASE}/orders`;
const PAYMENTS_URL = `${API_BASE}/payments`;

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ----------------------------------------------------
// RAW API (Service Layer - used by usePlaceOrder.js)
// ----------------------------------------------------

// 1. Finalize checkout session
export async function finalizeCheckoutAPI({
  token,
  checkoutSessionId,
  shippingAddress,
  billingAddress,
  shippingMethod,
}) {
  const res = await axios.post(
    `${ORDERS_URL}/finalize-checkout`,
    { checkoutSessionId, shippingAddress, billingAddress, shippingMethod },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

// 2. Create order draft
export async function createOrderDraftAPI({
  token,
  checkoutSessionId,
  paymentGateway,
}) {
  const res = await axios.post(
    `${ORDERS_URL}/draft`,
    { checkoutSessionId, paymentGateway },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

// 3. Initialize payment (Stripe / Razorpay / any future gateway)
export async function initPaymentAPI({ token, orderId, gateway }) {
  const res = await axios.post(
    `${PAYMENTS_URL}/init`,
    { orderId, gateway },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

// ----------------------------------------------------
// REACT QUERY HOOKS (Used by components or checkout)
// ----------------------------------------------------

// Create final order (used on success page or admin components)
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation(
    async (orderData) => {
      const res = await axios.post(ORDERS_URL, orderData, {
        headers: authHeader(),
      });
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['order', data._id], data);
      },
    }
  );
}

// Fetch a specific order
export function useGetOrder(orderId) {
  return useQuery(
    ['order', orderId],
    async () => {
      const res = await axios.get(`${ORDERS_URL}/${orderId}`, {
        headers: authHeader(),
      });
      return res.data;
    },
    {
      enabled: !!orderId,
      staleTime: 5 * 60 * 1000,
    }
  );
}

// Request a Stripe session
export function useCreateStripeSession() {
  return useMutation(async (orderId) => {
    const res = await axios.post(
      `${PAYMENTS_URL}/stripe-session`,
      { orderId },
      { headers: authHeader() }
    );
    return res.data;
  });
}

// Request a Razorpay order
export function useCreateRazorpayOrder() {
  return useMutation(async (orderId) => {
    const res = await axios.post(
      `${PAYMENTS_URL}/razorpay-order`,
      { orderId },
      { headers: authHeader() }
    );
    return res.data;
  });
}

// Verify Razorpay payment
export function useVerifyRazorpayPayment() {
  const queryClient = useQueryClient();

  return useMutation(
    async (payload) => {
      const res = await axios.post(`${PAYMENTS_URL}/razorpay-verify`, payload, {
        headers: authHeader(),
      });
      return res.data;
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['order', variables.orderId]);
      },
    }
  );
}
