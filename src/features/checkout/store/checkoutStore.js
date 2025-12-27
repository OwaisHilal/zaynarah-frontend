// src/features/checkout/store/checkoutStore.js
import { create } from 'zustand';
import { produce } from 'immer';

import {
  initCheckoutSessionAPI,
  finalizePricingAPI,
  createStripeSessionAPI,
  createRazorpayOrderAPI,
  getShippingMethods,
} from '../services/useCheckoutApi';

import { startPayment } from '../hooks/usePaymentHandler';

const STORAGE_KEY = 'checkout_session_v1';

const initialState = {
  currentStep: 1,
  totalSteps: 5,

  user: null,

  checkoutSessionId: null,
  orderId: null,

  shippingAddress: null,
  billingAddress: null,
  shippingMethod: null,

  paymentMethod: 'stripe',
  paymentDetails: null,

  shippingMethods: [],
  shippingLoading: false,
  shippingError: '',

  loading: false,
};

const persistState = (state) => {
  const {
    currentStep,
    checkoutSessionId,
    orderId,
    shippingAddress,
    billingAddress,
    shippingMethod,
    paymentMethod,
    paymentDetails,
  } = state;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      currentStep,
      checkoutSessionId,
      orderId,
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod,
      paymentDetails,
    })
  );
};

const hydrateState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
};

export const useCheckoutStore = create((set, get) => ({
  ...initialState,
  ...hydrateState(),

  setUser: (u) => {
    if (!u || get().user?._id === u._id) return;
    set({ user: u });
  },

  setCurrentStep: (s) => {
    set({ currentStep: s });
    persistState(get());
  },

  setShippingAddress: (addr) =>
    set(
      produce((draft) => {
        draft.shippingAddress = addr;
        draft.billingAddress = draft.billingAddress || addr;
        draft.shippingMethod = null;
        draft.shippingMethods = [];
        draft.shippingError = '';
      }),
      false,
      () => persistState(get())
    ),

  setBillingAddress: (addr) => {
    set({ billingAddress: addr });
    persistState(get());
  },

  setShippingMethod: (method) => {
    set({ shippingMethod: method });
    persistState(get());
  },

  setPaymentMethod: (method) =>
    set(
      produce((draft) => {
        draft.paymentMethod = method;
        draft.paymentDetails = null;
      }),
      false,
      () => persistState(get())
    ),

  setPaymentDetails: (details) => {
    set({ paymentDetails: details });
    persistState(get());
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
      default:
        return null;
    }
  },

  nextStep: async () => {
    const step = get().currentStep;
    const err = get().validateStep(step);
    if (err) return { error: err };

    if (step === 1 && !get().checkoutSessionId) {
      set({ loading: true });
      try {
        const res = await initCheckoutSessionAPI();
        set({
          checkoutSessionId: res.checkoutSessionId,
          orderId: res.orderId,
        });
        persistState(get());
      } finally {
        set({ loading: false });
      }
    }

    if (step === 2) {
      set({ loading: true });
      try {
        await finalizePricingAPI({
          checkoutSessionId: get().checkoutSessionId,
          shippingAddress: get().shippingAddress,
          billingAddress: get().billingAddress || get().shippingAddress,
          shippingMethod: get().shippingMethod,
        });
        persistState(get());
      } finally {
        set({ loading: false });
      }
    }

    set((s) => ({
      currentStep: Math.min(s.currentStep + 1, s.totalSteps),
    }));

    persistState(get());
    return { error: null };
  },

  prevStep: () => {
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) }));
    persistState(get());
  },

  resetCheckout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ ...initialState });
  },

  loadShippingMethods: async () => {
    const addr = get().shippingAddress;
    if (!addr) return [];

    set({ shippingLoading: true, shippingError: '' });

    try {
      const methods = await getShippingMethods(addr);
      set({ shippingMethods: methods || [] });
      return methods || [];
    } catch (err) {
      set({
        shippingMethods: [],
        shippingError: err.message || 'Failed to load shipping methods',
      });
      return [];
    } finally {
      set({ shippingLoading: false });
    }
  },

  startPaymentFlow: async () => {
    const { orderId, paymentMethod } = get();
    if (!orderId) throw new Error('Order not ready');

    set({ loading: true });

    try {
      if (paymentMethod === 'stripe') {
        const session = await createStripeSessionAPI(orderId);
        await startPayment('stripe', session);
      } else {
        const rp = await createRazorpayOrderAPI(orderId);
        await startPayment('razorpay', rp);
      }
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCheckoutStore;
export const useCheckout = () => useCheckoutStore();
