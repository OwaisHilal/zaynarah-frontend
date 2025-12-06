import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const useCartStore = create((set, get) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      // unify id from backend (_id) or frontend (id)
      const idKey = item._id || item.id;
      const found = state.cart.find((i) => (i._id || i.id) === idKey);
      if (found) {
        const newCart = state.cart.map((i) =>
          (i._id || i.id) === idKey ? { ...i, qty: (i.qty || 1) + 1 } : i
        );

        // Try sync in background
        syncAddToCart({ ...item, qty: (found.qty || 1) + 1 }).catch(() => {});

        return { cart: newCart };
      }

      // new item
      const newItem = { ...item, qty: 1 };
      // attempt background sync
      syncAddToCart(newItem).catch(() => {});
      return { cart: [...state.cart, newItem] };
    }),

  removeFromCart: (id) =>
    set((state) => {
      const newCart = state.cart.filter((item) => (item._id || item.id) !== id);
      // attempt server remove
      syncRemoveFromCart(id).catch(() => {});
      return { cart: newCart };
    }),

  updateQty: (id, qty) =>
    set((state) => {
      const newCart = state.cart.map((item) =>
        (item._id || item.id) === id ? { ...item, qty } : item
      );
      // attempt server update
      syncUpdateCartQty(id, qty).catch(() => {});
      return { cart: newCart };
    }),

  clearCart: () => {
    // attempt server clear
    syncClearCart().catch(() => {});
    return set({ cart: [] });
  },
}));

const getAuthToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (e) {
    return null;
  }
};

const syncAddToCart = async (item) => {
  const token = getAuthToken();
  if (!token) return;
  await fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId: item._id || item.id,
      quantity: item.qty || 1,
    }),
  });
};

const syncRemoveFromCart = async (id) => {
  const token = getAuthToken();
  if (!token) return;
  // backend defines: DELETE /remove/:productId
  await fetch(`${API_BASE}/cart/remove/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const syncUpdateCartQty = async (id, qty) => {
  const token = getAuthToken();
  if (!token) return;
  // backend defines: PUT /update/:productId with body { quantity }
  await fetch(`${API_BASE}/cart/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity: qty }),
  });
};

const syncClearCart = async () => {
  const token = getAuthToken();
  if (!token) return;
  await fetch(`${API_BASE}/cart/clear`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
