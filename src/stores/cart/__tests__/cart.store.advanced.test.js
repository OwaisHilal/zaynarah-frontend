// src/stores/cart/__tests__/cart.store.advanced.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCartDomainStore } from '../cart.store';
import { useCartUIStore } from '../cart.ui.store';

const API_BASE = 'http://localhost:5000/api';

const resetCart = () => {
  localStorage.clear();
  sessionStorage.clear();
  useCartDomainStore.setState({
    items: [],
    count: 0,
    total: 0,
    hydrated: false,
  });
};

const mockFetch = (impl) => {
  globalThis.fetch = vi.fn(impl);
};

describe('cart.store — adversarial domain behavior', () => {
  beforeEach(() => {
    resetCart();
    vi.restoreAllMocks();
  });

  it('mergeOnLogin hydrates without posting when guest cart is empty', async () => {
    localStorage.setItem('token', 'x');

    mockFetch(async (url) => {
      if (url === `${API_BASE}/cart`) {
        return {
          ok: true,
          json: async () => ({ items: [] }),
        };
      }
      throw new Error('unexpected');
    });

    await useCartDomainStore.getState().mergeOnLogin();

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('mergeOnLogin posts guest items exactly once and clears guest storage', async () => {
    localStorage.setItem('token', 'x');
    localStorage.setItem(
      'guest_cart_items',
      JSON.stringify([{ productId: 'p1', price: 100, qty: 1 }])
    );

    let mergeCalls = 0;

    mockFetch(async (url) => {
      if (url === `${API_BASE}/cart/merge`) {
        mergeCalls++;
        return { ok: true };
      }

      if (url === `${API_BASE}/cart`) {
        return {
          ok: true,
          json: async () => ({ items: [] }),
        };
      }

      throw new Error('unexpected');
    });

    await useCartDomainStore.getState().mergeOnLogin();

    expect(mergeCalls).toBe(1);
    expect(localStorage.getItem('guest_cart_items')).toBe(null);
  });

  it('mergeOnLogin is idempotent when called twice', async () => {
    localStorage.setItem('token', 'x');
    localStorage.setItem(
      'guest_cart_items',
      JSON.stringify([{ productId: 'p1', price: 100, qty: 1 }])
    );

    let mergeCalls = 0;

    mockFetch(async (url) => {
      if (url === `${API_BASE}/cart/merge`) {
        mergeCalls++;
        return { ok: true };
      }

      if (url === `${API_BASE}/cart`) {
        return {
          ok: true,
          json: async () => ({ items: [] }),
        };
      }

      throw new Error('unexpected');
    });

    await useCartDomainStore.getState().mergeOnLogin();
    await useCartDomainStore.getState().mergeOnLogin();

    expect(mergeCalls).toBe(1);
  });

  it('does not clear guest cart if merge request fails', async () => {
    localStorage.setItem('token', 'x');
    localStorage.setItem(
      'guest_cart_items',
      JSON.stringify([{ productId: 'p1', price: 100, qty: 1 }])
    );

    mockFetch(async (url) => {
      if (url === `${API_BASE}/cart/merge`) {
        throw new Error('network fail');
      }
      throw new Error('unexpected');
    });

    await useCartDomainStore.getState().mergeOnLogin();

    expect(localStorage.getItem('guest_cart_items')).not.toBe(null);
  });

  it('hydrates even when backend returns malformed data', async () => {
    localStorage.setItem('token', 'x');

    mockFetch(async () => ({
      ok: true,
      json: async () => ({}),
    }));

    await useCartDomainStore.getState().hydrate();

    const state = useCartDomainStore.getState();
    expect(state.items).toEqual([]);
    expect(state.hydrated).toBe(true);
  });

  it('adding same product twice as guest accumulates quantity', async () => {
    await useCartDomainStore.getState().add({ _id: 'p1', price: 100 }, 1);
    await useCartDomainStore.getState().add({ _id: 'p1', price: 100 }, 2);

    const state = useCartDomainStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.count).toBe(3);
    expect(state.total).toBe(300);
  });
});

describe('cart.ui.store — corrected behavior', () => {
  beforeEach(() => {
    useCartUIStore.setState({ updatingIds: [] });
  });

  it('tracks updating ids correctly', () => {
    useCartUIStore.getState().startUpdating('p1');
    useCartUIStore.getState().startUpdating('p2');

    expect(useCartUIStore.getState().updatingIds).toEqual(['p1', 'p2']);

    useCartUIStore.getState().stopUpdating('p1');

    expect(useCartUIStore.getState().updatingIds).toEqual(['p2']);
  });

  it('isUpdating returns correct boolean and never throws', () => {
    expect(useCartUIStore.getState().isUpdating('p1')).toBe(false);

    useCartUIStore.getState().startUpdating('p1');

    expect(useCartUIStore.getState().isUpdating('p1')).toBe(true);

    useCartUIStore.getState().stopUpdating('p1');

    expect(useCartUIStore.getState().isUpdating('p1')).toBe(false);
  });
});
