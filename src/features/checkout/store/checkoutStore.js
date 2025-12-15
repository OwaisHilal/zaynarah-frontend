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

  // shipping methods cache for last selected address
  shippingMethods: [],
  shippingLoading: false,
  shippingError: '',
};

export const useCheckoutStore = create((set, get) => ({
  ...initialState,

  // -------------------------
  // Setters
  // -------------------------
  setUser: (u) => set({ user: u }),

  setCurrentStep: (s) => set({ currentStep: s }),

  setShippingAddress: (addr) =>
    set(
      produce((draft) => {
        draft.shippingAddress = addr;
        // when address changes, reset shippingMethod and shippingMethods
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
        // clear payment details when switching
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
        if (!s.paymentMethod) return 'Please select a payment method.';
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
        if (s.paymentMethod === 'razorpay') {
          if (!s.paymentDetails?.name) return 'Payment details incomplete.';
          if (!s.paymentDetails?.phone) return 'Payment details incomplete.';
        }
        return null;
      default:
        return null;
    }
  },

  isNextDisabled: (step = get().currentStep) => !!get().validateStep(step),

  nextStep: () => {
    const err = get().validateStep(get().currentStep);
    if (err) {
      // do not call alert here — components should show message
      return { error: err };
    }
    set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps) }));
    return { error: null };
  },

  prevStep: () => {
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) }));
  },

  resetCheckout: () =>
    set({
      ...initialState,
    }),

  // -------------------------
  // Shipping methods loader
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
  // Place order + payment flow
  // -------------------------
  buildCheckoutPayload: ({ cart, cartTotal }) => {
    if (!Array.isArray(cart) || cart.length === 0) {
      throw new Error('Your cart is empty.');
    }

    const s = get();
    const items = cart.map((c) => {
      const productId =
        c.productId || (c.product && c.product._id) || c.id || c._id;
      return {
        productId,
        title: c.title || c.name || '',
        price: Number(c.price || 0),
        qty: Number(c.qty || c.quantity || 1),
        image: c.image || '',
        sku: c.sku || '',
      };
    });

    return {
      items,
      cartTotal: {
        items: Number((cartTotal && cartTotal.items) || 0),
        shipping: Number((cartTotal && cartTotal.shipping) || 0),
        tax: Number((cartTotal && cartTotal.tax) || 0),
        grand: Number((cartTotal && cartTotal.grand) || 0),
        currency: (cartTotal && cartTotal.currency) || 'INR',
      },
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
      const validationError = get().validateStep(4);
      if (validationError) throw new Error(validationError);

      const payload = get().buildCheckoutPayload({ cart, cartTotal });

      const order = await placeOrderAPI(payload);
      set({ orderData: order });

      const pm = get().paymentMethod;
      if (pm && order && order._id) {
        if (pm === 'stripe') {
          const session = await createStripeSessionAPI(order._id);
          const sid =
            session?.sessionId || session?.id || session?.checkoutSessionId;
          const pk =
            session?.publishableKey ||
            session?.publishable_key ||
            session?.publishable;
          if (!sid || !pk) throw new Error('Stripe session creation failed.');
          await startPayment('stripe', { publishableKey: pk, sessionId: sid });
        } else if (pm === 'razorpay') {
          const rp = await createRazorpayOrderAPI(order._id);
          const orderId = rp?.orderId || rp?.id || rp?.order_id;
          const key = rp?.key || rp?.key_id || rp?.keyId;
          const amount = rp?.amount;
          const currency = rp?.currency;
          if (!orderId || !key || !amount)
            throw new Error('Razorpay order creation failed.');
          await startPayment('razorpay', { key, amount, currency, orderId });
        }
      }

      return order;
    } finally {
      set({ loading: false });
    }
  },
}));

// convenience compatibility hook -> existing components can import useCheckout()
export const useCheckout = () => useCheckoutStore();
export default useCheckoutStore;
