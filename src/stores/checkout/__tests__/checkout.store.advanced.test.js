// src/stores/checkout/__tests__/checkout.store.advanced.test.js
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

describe('checkout.store — adversarial behavior', () => {
  beforeEach(() => {
    resetStore();
    vi.resetAllMocks();
  });

  it('hydrate crashes on corrupted localStorage (documented bug)', () => {
    localStorage.setItem(STORAGE_KEY, '{ bad json');

    expect(() => useCheckoutDomainStore.getState().hydrate()).toThrow();
  });

  it('ensureSession is not concurrency-safe (expected failure)', async () => {
    api.initCheckoutSessionAPI.mockResolvedValue({
      checkoutSessionId: 'cs1',
      orderId: 'o1',
    });

    await Promise.all([
      useCheckoutDomainStore.getState().ensureSession(),
      useCheckoutDomainStore.getState().ensureSession(),
      useCheckoutDomainStore.getState().ensureSession(),
    ]);

    expect(api.initCheckoutSessionAPI.mock.calls.length).toBeGreaterThan(1);
  });

  it('loadShippingMethods does nothing when address is missing', async () => {
    await useCheckoutDomainStore.getState().loadShippingMethods();

    const s = useCheckoutDomainStore.getState();
    expect(s.shippingLoading).toBe(false);
    expect(s.shippingMethods).toEqual([]);
  });

  it('loadShippingMethods sets error on API failure', async () => {
    const addr = { city: 'Delhi' };
    api.getShippingMethods.mockRejectedValueOnce(new Error('shipping down'));

    useCheckoutDomainStore.getState().setShippingAddress(addr);
    await useCheckoutDomainStore.getState().loadShippingMethods();

    const s = useCheckoutDomainStore.getState();
    expect(s.shippingError).toContain('shipping');
    expect(s.shippingMethods).toEqual([]);
    expect(s.shippingLoading).toBe(false);
  });

  it('does not auto-select shipping method when multiple are returned', async () => {
    const addr = { city: 'Delhi' };
    api.getShippingMethods.mockResolvedValueOnce([
      { id: 'std' },
      { id: 'exp' },
    ]);

    useCheckoutDomainStore.getState().setShippingAddress(addr);
    await useCheckoutDomainStore.getState().loadShippingMethods();

    const s = useCheckoutDomainStore.getState();
    expect(s.shippingMethod).toBe(null);
    expect(s.shippingMethods.length).toBe(2);
  });

  it('startPayment throws when orderId is missing', async () => {
    await expect(
      useCheckoutDomainStore.getState().startPayment()
    ).rejects.toThrow('Order not ready');
  });

  it('propagates payment failure without mutating state', async () => {
    useCheckoutDomainStore.setState({
      orderId: 'o1',
      paymentMethod: 'stripe',
    });

    payment.startPayment.mockRejectedValueOnce(new Error('stripe fail'));

    await expect(
      useCheckoutDomainStore.getState().startPayment()
    ).rejects.toThrow();

    const s = useCheckoutDomainStore.getState();
    expect(s.orderId).toBe('o1');
    expect(s.paymentMethod).toBe('stripe');
  });

  it('persist stores only whitelisted fields', () => {
    useCheckoutDomainStore.setState({
      checkoutSessionId: 'cs1',
      orderId: 'o1',
      shippingAddress: { city: 'Delhi' },
      billingAddress: { city: 'Delhi' },
      shippingMethod: { id: 'std' },
      paymentMethod: 'razorpay',
      paymentDetails: { x: 1 },
      shippingLoading: true,
      shippingError: 'x',
    });

    useCheckoutDomainStore.getState().persist();

    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));

    expect(raw.shippingLoading).toBeUndefined();
    expect(raw.shippingError).toBeUndefined();
    expect(raw.checkoutSessionId).toBe('cs1');
    expect(raw.paymentMethod).toBe('razorpay');
  });

  it('reset clears corrupted storage safely', () => {
    localStorage.setItem(STORAGE_KEY, '{ bad json');

    expect(() => useCheckoutDomainStore.getState().reset()).not.toThrow();

    expect(localStorage.getItem(STORAGE_KEY)).toBe(null);
  });
});
