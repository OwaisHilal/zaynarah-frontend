// src/stores/checkout/__tests__/checkout.store.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCheckoutDomainStore } from '../checkout.store';
import * as api from '@/features/checkout/services/useCheckoutApi';
import * as payment from '@/features/checkout/hooks/usePaymentHandler';

vi.mock('@/features/checkout/services/useCheckoutApi');
vi.mock('@/features/checkout/hooks/usePaymentHandler');

const STORAGE_KEY = 'checkout_domain_v1';

const resetStore = () => {
  localStorage.clear();
  useCheckoutDomainStore.setState({
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
};

describe('checkout.store — baseline behavior', () => {
  beforeEach(() => {
    resetStore();
    vi.resetAllMocks();
  });

  it('starts with empty checkout state', () => {
    const s = useCheckoutDomainStore.getState();
    expect(s.checkoutSessionId).toBe(null);
    expect(s.orderId).toBe(null);
    expect(s.shippingAddress).toBe(null);
    expect(s.paymentMethod).toBe('stripe');
  });

  it('hydrates from localStorage when present', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        checkoutSessionId: 'cs1',
        orderId: 'o1',
        paymentMethod: 'razorpay',
      })
    );

    useCheckoutDomainStore.getState().hydrate();

    const s = useCheckoutDomainStore.getState();
    expect(s.checkoutSessionId).toBe('cs1');
    expect(s.orderId).toBe('o1');
    expect(s.paymentMethod).toBe('razorpay');
  });

  it('setShippingAddress also sets billing address and resets shipping state', () => {
    const addr = { city: 'Delhi' };

    useCheckoutDomainStore.getState().setShippingAddress(addr);

    const s = useCheckoutDomainStore.getState();
    expect(s.shippingAddress).toBe(addr);
    expect(s.billingAddress).toBe(addr);
    expect(s.shippingMethod).toBe(null);
    expect(s.shippingMethods).toEqual([]);
  });

  it('setPaymentMethod clears paymentDetails', () => {
    useCheckoutDomainStore.setState({ paymentDetails: { x: 1 } });

    useCheckoutDomainStore.getState().setPaymentMethod('razorpay');

    const s = useCheckoutDomainStore.getState();
    expect(s.paymentMethod).toBe('razorpay');
    expect(s.paymentDetails).toBe(null);
  });

  it('loads shipping methods and auto-selects when only one', async () => {
    const addr = { city: 'Delhi' };
    api.getShippingMethods.mockResolvedValueOnce([{ id: 'std' }]);

    useCheckoutDomainStore.getState().setShippingAddress(addr);
    await useCheckoutDomainStore.getState().loadShippingMethods();

    const s = useCheckoutDomainStore.getState();
    expect(s.shippingMethods.length).toBe(1);
    expect(s.shippingMethod).toEqual({ id: 'std' });
    expect(s.shippingLoading).toBe(false);
  });

  it('ensureSession initializes session only once', async () => {
    api.initCheckoutSessionAPI.mockResolvedValueOnce({
      checkoutSessionId: 'cs1',
      orderId: 'o1',
    });

    await useCheckoutDomainStore.getState().ensureSession();
    await useCheckoutDomainStore.getState().ensureSession();

    expect(api.initCheckoutSessionAPI).toHaveBeenCalledTimes(1);

    const s = useCheckoutDomainStore.getState();
    expect(s.checkoutSessionId).toBe('cs1');
    expect(s.orderId).toBe('o1');
  });

  it('reset clears storage and restores defaults', () => {
    localStorage.setItem(STORAGE_KEY, 'x');
    useCheckoutDomainStore.setState({ orderId: 'o1' });

    useCheckoutDomainStore.getState().reset();

    const s = useCheckoutDomainStore.getState();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(null);
    expect(s.orderId).toBe(null);
    expect(s.paymentMethod).toBe('stripe');
  });
});
