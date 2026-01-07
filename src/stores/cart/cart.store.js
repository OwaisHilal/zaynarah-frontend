// src/stores/cart/cart.store.js
import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const GUEST_CART_KEY = 'guest_cart_items';

const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

const loadGuestItems = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
};

const saveGuestItems = (items) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {}
};

const clearGuestItems = () => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch {}
};

const calcTotals = (items) => {
  let count = 0;
  let total = 0;

  for (const i of items) {
    const qty = Number(i.qty) || 0;
    const price = Number(i.price) || 0;
    count += qty;
    total += price * qty;
  }

  return { count, total };
};

export const useCartDomainStore = create((set, get) => ({
  items: [],
  count: 0,
  total: 0,
  hydrated: false,

  _setItems(items) {
    const next = calcTotals(items);
    set({ items, ...next });
  },

  async hydrate() {
    const token = getToken();

    if (!token) {
      const guestItems = loadGuestItems();
      get()._setItems(guestItems);
      set({ hydrated: true });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        get()._setItems(data.items || []);
      }
    } finally {
      set({ hydrated: true });
    }
  },

  async mergeOnLogin() {
    const token = getToken();
    if (!token) return;

    const guestItems = loadGuestItems();
    if (!guestItems.length) {
      await get().hydrate();
      return;
    }

    try {
      await fetch(`${API_BASE}/cart/merge`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: guestItems }),
      });

      clearGuestItems();
      await get().hydrate();
    } catch {}
  },

  async add(product, qty = 1) {
    const productId = product?._id || product?.id || product?.productId;
    if (!productId) return;

    const token = getToken();

    if (!token) {
      const next = [...get().items];
      const existing = next.find((i) => i.productId === productId);

      if (existing) existing.qty += qty;
      else
        next.push({
          productId,
          title: product.title,
          price: product.price,
          image: product.image,
          qty,
        });

      saveGuestItems(next);
      get()._setItems(next);
      return;
    }

    await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity: qty }),
    });

    await get().hydrate();
  },

  async updateQty(productId, qty) {
    const token = getToken();

    if (!token) {
      const next = get().items.map((i) =>
        i.productId === productId ? { ...i, qty } : i
      );
      saveGuestItems(next);
      get()._setItems(next);
      return;
    }

    await fetch(`${API_BASE}/cart/update/${productId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: qty }),
    });

    await get().hydrate();
  },

  async remove(productId) {
    const token = getToken();

    if (!token) {
      const next = get().items.filter((i) => i.productId !== productId);
      saveGuestItems(next);
      get()._setItems(next);
      return;
    }

    await fetch(`${API_BASE}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    await get().hydrate();
  },

  async clear() {
    const token = getToken();

    if (!token) {
      clearGuestItems();
      get()._setItems([]);
      return;
    }

    await fetch(`${API_BASE}/cart/clear`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    get()._setItems([]);
  },

  resetToGuest() {
    const guestItems = loadGuestItems();
    get()._setItems(guestItems);
  },
}));
