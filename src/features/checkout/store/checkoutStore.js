// src/features/checkout/store/checkoutStore.js
import { create } from 'zustand';
import { produce } from 'immer';

import {
  placeOrderAPI,
  createStripeSessionAPI,
  createRazorpayOrderAPI,
  getShippingMethods,
} from '../services/useCheckoutApi';
import { startPayment } from '../hooks/usePaymentHandler';

const initialState = {
  currentStep: 1,
  totalSteps: 5,
  shippingAddress: null,
  shippingMethod: null,
  paymentMethod: 'stripe',
  billingAddress: null,
  paymentDetails: null,
  orderData: null,
  user: null,
  loading: false,
  checkoutSessionId: null,

  shippingMethods: [],
  shippingLoading: false,
  shippingError: '',
};

export const useCheckoutStore = create((set, get) => ({
  ...initialState,

  // -------------------------
  // Setters (SAFE)
  // -------------------------
  setUser: (u) => {
    const current = get().user;
    if (!u || current?.id === u?.id) return;
    set({ user: u });
  },

  setCurrentStep: (s) => set({ currentStep: s }),

  setShippingAddress: (addr) =>
    set(
      produce((draft) => {
        draft.shippingAddress = addr;
        draft.shippingMethod = null;
        draft.shippingMethods = [];
        draft.shippingError = '';
      })
    ),

  setShippingMethod: (m) => set({ shippingMethod: m }),

  setPaymentMethod: (pm) =>
    set(
      produce((draft) => {
        draft.paymentMethod = pm;
        draft.paymentDetails = null;
      })
    ),

  setBillingAddress: (b) => set({ billingAddress: b }),

  setPaymentDetails: (d) => set({ paymentDetails: d }),

  setOrderData: (o) => set({ orderData: o }),

  setCheckoutSessionId: (id) => set({ checkoutSessionId: id }),

  setLoading: (v) => set({ loading: v }),

  // -------------------------
  // Navigation helpers
  // -------------------------
  isNextDisabled: (step = get().currentStep) => {
    return Boolean(get().validateStep(step));
  },

  validateStep: (step = get().currentStep) => {
    const s = get();
    switch (step) {
      case 1:
        if (!s.shippingAddress) return 'Please select a shipping address.';
        return null;
      case 2:
        if (!s.shippingMethod) return 'Please select a shipping method.';
        return null;
      case 3:
        if (!s.paymentMethod) return 'Please select a payment method.';
        return null;
      case 4:
        if (s.paymentMethod === 'razorpay') {
          if (!s.paymentDetails?.name)
            return 'Full name required for Razorpay.';
          if (!s.paymentDetails?.phone)
            return 'Phone number required for Razorpay.';
        }
        return null;
      case 5:
        if (!s.shippingAddress) return 'Missing shipping address.';
        if (!s.shippingMethod) return 'Missing shipping method.';
        if (!s.paymentMethod) return 'Missing payment method.';
        return null;
      default:
        return null;
    }
  },

  nextStep: () => {
    const err = get().validateStep(get().currentStep);
    if (err) return { error: err };
    set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps) }));
    return { error: null };
  },

  prevStep: () => {
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) }));
  },

  resetCheckout: () => set({ ...initialState }),

  // -------------------------
  // Shipping
  // -------------------------
  loadShippingMethods: async () => {
    const addr = get().shippingAddress;
    if (!addr) {
      set({ shippingMethods: [], shippingError: '' });
      return [];
    }

    set({ shippingLoading: true, shippingError: '' });
    try {
      const methods = await getShippingMethods(addr);
      set({ shippingMethods: methods || [], shippingLoading: false });
      return methods || [];
    } catch (err) {
      set({
        shippingMethods: [],
        shippingLoading: false,
        shippingError: err.message || 'Could not load shipping options.',
      });
      return [];
    }
  },

  // -------------------------
  // Place order + payment
  // -------------------------
  buildCheckoutPayload: ({ cart, cartTotal }) => {
    if (!Array.isArray(cart) || cart.length === 0) {
      throw new Error('Your cart is empty.');
    }

    const s = get();
    const items = cart.map((c) => ({
      productId: c.productId || (c.product && c.product._id) || c.id || c._id,
      title: c.title || c.name || '',
      price: Number(c.price || 0),
      qty: Number(c.qty || c.quantity || 1),
      image: c.image || '',
      sku: c.sku || '',
    }));

    return {
      items,
      cartTotal,
      user: s.user,
      shippingAddress: s.shippingAddress,
      billingAddress: s.billingAddress || s.shippingAddress,
      shippingMethod: s.shippingMethod,
      paymentMethod: s.paymentMethod,
      paymentDetails: s.paymentDetails,
      metadata: { createdFrom: 'frontend' },
    };
  },

  placeOrderAndPay: async ({ cart, cartTotal }) => {
    set({ loading: true });
    try {
      const payload = get().buildCheckoutPayload({ cart, cartTotal });
      const order = await placeOrderAPI(payload);
      set({ orderData: order });

      if (order?._id) {
        if (get().paymentMethod === 'stripe') {
          const session = await createStripeSessionAPI(order._id);
          await startPayment('stripe', {
            publishableKey: session.publishableKey,
            sessionId: session.sessionId,
          });
        } else {
          const rp = await createRazorpayOrderAPI(order._id);
          await startPayment('razorpay', rp);
        }
      }

      return order;
    } finally {
      set({ loading: false });
    }
  },
}));

export const useCheckout = () => useCheckoutStore();
export default useCheckoutStore;
