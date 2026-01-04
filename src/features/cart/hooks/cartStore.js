// src/features/cart/hooks/cartStore.js
import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const GUEST_CART_KEY = 'guest_cart_items';

const getAuthToken = () => {
  try {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  } catch {
    return null;
  }
};

const loadGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
};

const saveGuestCart = (items) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {}
};

const clearGuestCart = () => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch {}
};

const calcCount = (items) =>
  (items || []).reduce((sum, i) => sum + (i.qty || 0), 0);

const calcTotal = (items) =>
  (items || []).reduce(
    (sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 0),
    0
  );

export const useCartStore = create((set, get) => ({
  cart: [],
  cartCount: 0,
  cartTotal: 0,
  loading: false,

  _applyCart(items = []) {
    set({
      cart: items,
      cartCount: calcCount(items),
      cartTotal: calcTotal(items),
    });
  },

  hydrateCart() {
    const token = getAuthToken();
    if (token) {
      get().fetchCart();
      return;
    }
    const guestItems = loadGuestCart();
    get()._applyCart(guestItems);
  },

  async fetchCart() {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;
      const data = await res.json();
      get()._applyCart(data.items || []);
    } catch {}
  },

  async fetchCartFromServer() {
    return get().fetchCart();
  },

  addToCart(product, qty = 1) {
    const token = getAuthToken();
    const productId = product?._id || product?.id || product?.productId;
    if (!productId) return false;

    if (!token) {
      const current = loadGuestCart();
      const existing = current.find((i) => i.productId === productId);

      const next = existing
        ? current.map((i) =>
            i.productId === productId ? { ...i, qty: i.qty + qty } : i
          )
        : [
            ...current,
            {
              productId,
              title: product.title,
              price: product.price,
              image: product.image,
              qty,
            },
          ];

      saveGuestCart(next);
      get()._applyCart(next);
      return true;
    }

    return (async () => {
      try {
        const res = await fetch(`${API_BASE}/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity: qty }),
        });

        if (!res.ok) return false;
        await get().fetchCart();
        return true;
      } catch {
        return false;
      }
    })();
  },

  removeFromCart(productId) {
    const token = getAuthToken();

    if (!token) {
      const next = loadGuestCart().filter((i) => i.productId !== productId);
      saveGuestCart(next);
      get()._applyCart(next);
      return;
    }

    return (async () => {
      try {
        await fetch(`${API_BASE}/cart/remove/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        await get().fetchCart();
      } catch {}
    })();
  },

  updateQty(productId, qty) {
    const token = getAuthToken();

    if (!token) {
      const next = loadGuestCart().map((i) =>
        i.productId === productId ? { ...i, qty } : i
      );
      saveGuestCart(next);
      get()._applyCart(next);
      return;
    }

    return (async () => {
      try {
        await fetch(`${API_BASE}/cart/update/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: qty }),
        });
        await get().fetchCart();
      } catch {}
    })();
  },

  clearCart() {
    const token = getAuthToken();

    if (!token) {
      clearGuestCart();
      get()._applyCart([]);
      return;
    }

    return (async () => {
      try {
        await fetch(`${API_BASE}/cart/clear`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        get()._applyCart([]);
      } catch {}
    })();
  },

  clearCartOnLogout() {
    const guestItems = loadGuestCart();
    get()._applyCart(guestItems);
  },

  async mergeCartOnLogin() {
    const token = getAuthToken();
    if (!token) return;

    const guestItems = loadGuestCart();
    if (!guestItems.length) {
      await get().fetchCart();
      return;
    }

    try {
      await fetch(`${API_BASE}/cart/merge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: guestItems }),
      });

      clearGuestCart();
      await get().fetchCart();
    } catch {}
  },
}));
