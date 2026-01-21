// src/stores/checkout/checkout.store.js
import { create } from 'zustand';
import {
  initCheckoutSessionAPI,
  finalizePricingAPI,
  createStripeSessionAPI,
  createRazorpayOrderAPI,
  getShippingMethods,
} from '@/features/checkout/services/useCheckoutApi';
import { startPayment as startGatewayPayment } from '@/features/checkout/hooks/usePaymentHandler';

const STORAGE_KEY = 'checkout_domain_v1';

export const useCheckoutDomainStore = create((set, get) => ({
  checkoutSessionId: null,
  orderId: null,

  shippingAddress: null,
  billingAddress: null,
  shippingMethod: null,

  shippingMethods: [],
  shippingLoading: false,
  shippingError: '',

  paymentMethod: 'stripe',
  paymentDetails: null,

  hydrate() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    set(JSON.parse(raw));
  },

  persist() {
    const {
      checkoutSessionId,
      orderId,
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod,
      paymentDetails,
    } = get();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        checkoutSessionId,
        orderId,
        shippingAddress,
        billingAddress,
        shippingMethod,
        paymentMethod,
        paymentDetails,
      }),
    );
  },

  setShippingAddress(addr) {
    set({
      shippingAddress: addr,
      billingAddress: addr,
      shippingMethod: null,
      shippingMethods: [],
      shippingError: '',
    });
    get().persist();
  },

  setBillingAddress(addr) {
    set({ billingAddress: addr });
    get().persist();
  },

  setShippingMethod(method) {
    set({ shippingMethod: method });
    get().persist();
  },

  setPaymentMethod(method) {
    set({ paymentMethod: method, paymentDetails: null });
    get().persist();
  },

  setPaymentDetails(details) {
    set({ paymentDetails: details });
    get().persist();
  },

  async loadShippingMethods() {
    const address = get().shippingAddress;
    if (!address) return;

    set({ shippingLoading: true, shippingError: '' });

    try {
      const methods = await getShippingMethods(address);
      set({ shippingMethods: methods || [] });

      if (methods?.length === 1 && !get().shippingMethod) {
        set({ shippingMethod: methods[0] });
      }
    } catch (e) {
      set({
        shippingMethods: [],
        shippingError: e.message || 'Failed to load shipping methods',
      });
    } finally {
      set({ shippingLoading: false });
    }
  },

  async ensureSession() {
    if (get().checkoutSessionId) return;
    const res = await initCheckoutSessionAPI();
    set({
      checkoutSessionId: res.checkoutSessionId,
      orderId: res.orderId,
    });
    get().persist();
  },

  async finalizePricing() {
    const {
      checkoutSessionId,
      shippingAddress,
      billingAddress,
      shippingMethod,
    } = get();

    await finalizePricingAPI({
      checkoutSessionId,
      shippingAddress,
      billingAddress,
      shippingMethod,
    });
  },

  async startPayment() {
    const { orderId, paymentMethod } = get();
    if (!orderId) throw new Error('Order not ready');

    if (paymentMethod === 'stripe') {
      const session = await createStripeSessionAPI(orderId);
      await startGatewayPayment('stripe', session);
      return;
    }

    const rp = await createRazorpayOrderAPI(orderId);
    await startGatewayPayment('razorpay', rp);
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    set({
      checkoutSessionId: null,
      orderId: null,
      shippingAddress: null,
      billingAddress: null,
      shippingMethod: null,
      shippingMethods: [],
      shippingLoading: false,
      shippingError: '',
      paymentMethod: 'stripe',
      paymentDetails: null,
    });
  },
}));
