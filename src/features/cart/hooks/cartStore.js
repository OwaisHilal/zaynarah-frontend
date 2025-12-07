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
  (cart || []).reduce((sum, i) => sum + (i.qty || 1), 0);

export const useCartStore = create((set, get) => ({
  cart: [],
  cartCount: 0,

  // Set full cart (after fetch/merge)
  setCart: (items) => set({ cart: items, cartCount: calculateCount(items) }),

  // Fetch cart from backend
  fetchCartFromServer: async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
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

      set({ cart: items, cartCount: calculateCount(items) });
      return items;
    } catch (err) {
      console.error('fetchCartFromServer', err);
    }
  },

  addToCart: async (item) => {
    const token = getAuthToken();
    const idKey = item._id || item.id;

    set((state) => {
      const found = state.cart.find((i) => i.productId === idKey);
      const newCart = found
        ? state.cart.map((i) =>
            i.productId === idKey ? { ...i, qty: i.qty + 1 } : i
          )
        : [...state.cart, { ...item, productId: idKey, qty: 1 }];
      return { cart: newCart, cartCount: calculateCount(newCart) };
    });

    if (token) {
      await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: idKey, quantity: 1 }),
      });
    }
  },

  removeFromCart: async (id) => {
    set((state) => {
      const newCart = state.cart.filter((i) => i.productId !== id);
      return { cart: newCart, cartCount: calculateCount(newCart) };
    });

    const token = getAuthToken();
    if (token) {
      await fetch(`${API_BASE}/cart/remove/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  },

  updateQty: async (id, qty) => {
    set((state) => {
      const newCart = state.cart.map((i) =>
        i.productId === id ? { ...i, qty } : i
      );
      return { cart: newCart, cartCount: calculateCount(newCart) };
    });

    const token = getAuthToken();
    if (token) {
      await fetch(`${API_BASE}/cart/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: qty }),
      });
    }
  },

  clearCart: async () => {
    set({ cart: [], cartCount: 0 });
    const token = getAuthToken();
    if (token) {
      await fetch(`${API_BASE}/cart/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
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
      set({ cart: items, cartCount: calculateCount(items) });
    } catch (err) {
      console.error('mergeCartOnLogin', err);
    }
  },
}));
