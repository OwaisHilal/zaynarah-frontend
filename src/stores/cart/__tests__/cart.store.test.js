// frontend/src/stores/cart/__tests__/cart.store.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCartDomainStore } from '../cart.store';

const API_BASE = 'http://localhost:5000/api';

const reset = () => {
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

describe('cart.store — baseline domain behavior', () => {
  beforeEach(() => {
    reset();
    vi.restoreAllMocks();
  });

  it('hydrates guest cart from localStorage when no token exists', async () => {
    localStorage.setItem(
      'guest_cart_items',
      JSON.stringify([
        { productId: 'p1', price: 100, qty: 2 },
        { productId: 'p2', price: 50, qty: 1 },
      ])
    );

    await useCartDomainStore.getState().hydrate();

    const state = useCartDomainStore.getState();
    expect(state.items.length).toBe(2);
    expect(state.count).toBe(3);
    expect(state.total).toBe(250);
    expect(state.hydrated).toBe(true);
  });

  it('hydrates auth cart from backend when token exists', async () => {
    localStorage.setItem('token', 'x');

    mockFetch(async (url) => {
      if (url === `${API_BASE}/cart`) {
        return {
          ok: true,
          json: async () => ({
            items: [{ productId: 'p1', price: 100, qty: 1 }],
          }),
        };
      }
      throw new Error('unexpected');
    });

    await useCartDomainStore.getState().hydrate();

    const state = useCartDomainStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.count).toBe(1);
    expect(state.total).toBe(100);
    expect(state.hydrated).toBe(true);
  });

  it('keeps existing cart state when auth hydrate fails', async () => {
    localStorage.setItem('token', 'x');

    useCartDomainStore.setState({
      items: [{ productId: 'p1', price: 100, qty: 2 }],
      count: 2,
      total: 200,
      hydrated: false,
    });

    mockFetch(async () => ({
      ok: false,
      status: 401,
    }));

    await useCartDomainStore.getState().hydrate();

    const state = useCartDomainStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.total).toBe(200);
    expect(state.hydrated).toBe(true);
  });

  it('adds item to guest cart and updates totals', async () => {
    await useCartDomainStore
      .getState()
      .add({ _id: 'p1', title: 'A', price: 100 }, 2);

    const state = useCartDomainStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.count).toBe(2);
    expect(state.total).toBe(200);

    const persisted = JSON.parse(localStorage.getItem('guest_cart_items'));
    expect(persisted.length).toBe(1);
  });

  it('updates quantity in guest cart correctly', async () => {
    localStorage.setItem(
      'guest_cart_items',
      JSON.stringify([{ productId: 'p1', price: 100, qty: 1 }])
    );

    useCartDomainStore.getState().resetToGuest();

    await useCartDomainStore.getState().updateQty('p1', 3);

    const state = useCartDomainStore.getState();
    expect(state.count).toBe(3);
    expect(state.total).toBe(300);
  });

  it('removes item from guest cart correctly', async () => {
    localStorage.setItem(
      'guest_cart_items',
      JSON.stringify([
        { productId: 'p1', price: 100, qty: 1 },
        { productId: 'p2', price: 50, qty: 1 },
      ])
    );

    useCartDomainStore.getState().resetToGuest();

    await useCartDomainStore.getState().remove('p1');

    const state = useCartDomainStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].productId).toBe('p2');
  });

  it('clears guest cart fully', async () => {
    localStorage.setItem(
      'guest_cart_items',
      JSON.stringify([{ productId: 'p1', price: 100, qty: 1 }])
    );

    useCartDomainStore.getState().resetToGuest();
    await useCartDomainStore.getState().clear();

    const state = useCartDomainStore.getState();
    expect(state.items.length).toBe(0);
    expect(state.count).toBe(0);
    expect(state.total).toBe(0);
    expect(localStorage.getItem('guest_cart_items')).toBe(null);
  });

  it('resetToGuest reloads guest items without network', () => {
    localStorage.setItem(
      'guest_cart_items',
      JSON.stringify([{ productId: 'p1', price: 100, qty: 2 }])
    );

    useCartDomainStore.getState().resetToGuest();

    const state = useCartDomainStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.total).toBe(200);
  });
});
