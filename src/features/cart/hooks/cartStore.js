// src/features/cart/hooks/cartStore.js
import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Utility to get auth token
const getAuthToken = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

// Helpers
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

  // -------------------------------------------
  // SET CART FROM SERVER NORMALIZED FORMAT
  // -------------------------------------------
  _applyCart(items = []) {
    set({
      cart: items,
      cartCount: calcCount(items),
      cartTotal: calcTotal(items),
    });
  },

  // -------------------------------------------
  // FETCH CART (Server-authoritative)
  // canonical name: fetchCart()
  // -------------------------------------------
  async fetchCart() {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;
      const data = await res.json();

      // Backend returns:
      // { items: [ { productId, title, price, image, qty } ] }
      const items = data.items || [];
      get()._applyCart(items);
    } catch (err) {
      console.error('❌ fetchCart error', err);
    }
  },

  // -----------------------
  // Backwards-compatible alias:
  // older code expects fetchCartFromServer()
  // -----------------------
  async fetchCartFromServer() {
    // simply forward to canonical fetchCart
    return await get().fetchCart();
  },

  // -------------------------------------------
  // ADD ITEM (server-only)
  // -------------------------------------------
  async addToCart(product, qty = 1) {
    const token = getAuthToken();
    if (!token) return alert('Login required');

    const productId = product._id || product.id || product.productId;
    if (!productId) return console.error('Missing productId');

    try {
      await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: qty }),
      });

      // ALWAYS fetch fresh server cart
      await get().fetchCart();
    } catch (err) {
      console.error('❌ addToCart error', err);
    }
  },

  // -------------------------------------------
  // REMOVE ITEM
  // -------------------------------------------
  async removeFromCart(productId) {
    const token = getAuthToken();
    if (!token) return;

    try {
      await fetch(`${API_BASE}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      await get().fetchCart();
    } catch (err) {
      console.error('❌ removeFromCart error', err);
    }
  },

  // -------------------------------------------
  // UPDATE QTY
  // -------------------------------------------
  async updateQty(productId, qty) {
    const token = getAuthToken();
    if (!token) return;

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
    } catch (err) {
      console.error('❌ updateQty error', err);
    }
  },

  // -------------------------------------------
  // CLEAR CART
  // -------------------------------------------
  async clearCart() {
    const token = getAuthToken();
    if (!token) return;

    try {
      await fetch(`${API_BASE}/cart/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      get()._applyCart([]);
    } catch (err) {
      console.error('❌ clearCart error', err);
    }
  },

  // -------------------------------------------
  // LOGOUT: wipe local cart
  // -------------------------------------------
  clearCartOnLogout() {
    get()._applyCart([]);
  },

  // -------------------------------------------
  // LOGIN MERGE (server authoritative)
  // -------------------------------------------
  async mergeCartOnLogin(localCart) {
    const token = getAuthToken();
    if (!token || !localCart?.length) return;

    try {
      await fetch(`${API_BASE}/cart/merge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: localCart }),
      });

      await get().fetchCart();
    } catch (err) {
      console.error('❌ mergeCartOnLogin error', err);
    }
  },
}));
