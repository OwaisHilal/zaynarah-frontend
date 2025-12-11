// src/features/cart/hooks/cartStore.js
import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Utility to get auth token
const getAuthToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (e) {
    return null;
  }
};

// Calculate total cart count
const calculateCount = (cart) =>
  (cart || []).reduce((sum, i) => sum + (i.qty || 0), 0);

// Calculate total cart price
const calculateTotal = (cart) =>
  (cart || []).reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0);

export const useCartStore = create((set, get) => ({
  cart: [],
  cartCount: 0,
  cartTotal: 0,

  setCart: (items) => {
    const count = calculateCount(items);
    const total = calculateTotal(items);
    set({ cart: items, cartCount: count, cartTotal: total });
  },

  fetchCartFromServer: async () => {
    const token = getAuthToken();
    if (!token) return [];

    try {
      const res = await fetch(`${API_BASE}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];

      const data = await res.json();
      const items = (data.items || []).map((i) => ({
        productId: i.product._id,
        title: i.product.title,
        price: i.product.price,
        image: i.product.image,
        qty: i.quantity,
      }));

      get().setCart(items);
      return items;
    } catch (err) {
      console.error('fetchCartFromServer', err);
      return [];
    }
  },

  addToCart: async (item, qty = 1) => {
    const token = getAuthToken();
    const productId = item._id || item.id;

    set((state) => {
      const exists = state.cart.find((i) => i.productId === productId);
      const newCart = exists
        ? state.cart.map((i) =>
            i.productId === productId ? { ...i, qty: i.qty + qty } : i
          )
        : [...state.cart, { ...item, productId, qty }];
      return {
        ...state,
        cart: newCart,
        cartCount: calculateCount(newCart),
        cartTotal: calculateTotal(newCart),
      };
    });

    if (token) {
      try {
        await fetch(`${API_BASE}/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity: qty }),
        });
      } catch (err) {
        console.error('addToCart API error', err);
      }
    }
  },

  removeFromCart: async (productId) => {
    set((state) => {
      const newCart = state.cart.filter((i) => i.productId !== productId);
      return {
        ...state,
        cart: newCart,
        cartCount: calculateCount(newCart),
        cartTotal: calculateTotal(newCart),
      };
    });

    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/cart/remove/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('removeFromCart API error', err);
      }
    }
  },

  updateQty: async (productId, qty) => {
    set((state) => {
      const newCart = state.cart.map((i) =>
        i.productId === productId ? { ...i, qty } : i
      );
      return {
        ...state,
        cart: newCart,
        cartCount: calculateCount(newCart),
        cartTotal: calculateTotal(newCart),
      };
    });

    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/cart/update/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: qty }),
        });
      } catch (err) {
        console.error('updateQty API error', err);
      }
    }
  },

  clearCart: async () => {
    set({ cart: [], cartCount: 0, cartTotal: 0 });
    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/cart/clear`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('clearCart API error', err);
      }
    }
  },

  clearCartOnLogout: () => {
    set({ cart: [], cartCount: 0, cartTotal: 0 });
  },

  mergeCartOnLogin: async (clientCart) => {
    const token = getAuthToken();
    if (!token || !clientCart?.length) return;

    try {
      const res = await fetch(`${API_BASE}/cart/merge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: clientCart }),
      });
      if (!res.ok) return;

      const data = await res.json();
      const items = (data.items || []).map((i) => ({
        productId: i.product._id,
        title: i.product.title,
        price: i.product.price,
        image: i.product.image,
        qty: i.quantity,
      }));

      get().setCart(items);
    } catch (err) {
      console.error('mergeCartOnLogin', err);
    }
  },
}));
