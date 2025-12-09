// src/features/user/hooks/useUser.js
import { create } from 'zustand';
import { useCartStore } from '../../cart/hooks/cartStore';

const loginUserApi = async ({ email, password }) => {
  await new Promise((res) => setTimeout(res, 500));
  if (email === 'admin@example.com' && password === 'password') {
    return { id: 1, name: 'Admin User', email, role: 'admin' };
  }
  if (email === 'test@example.com' && password === 'password') {
    return { id: 2, name: 'Test User', email, role: 'customer' };
  }
  throw new Error('Invalid email or password');
};

const signupUserApi = async ({ name, email, password }) => {
  await new Promise((res) => setTimeout(res, 500));
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }
  return { id: Date.now(), name, email, role: 'customer' };
};

const fetchUserProfileApi = async () => {
  await new Promise((res) => setTimeout(res, 300));
  return {
    id: 2,
    name: 'Test User',
    email: 'test@example.com',
    role: 'customer',
  };
};

// Zustand store with persistent login
export const useUserStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,

  // --- login ---
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const user = await loginUserApi(credentials);
      set({ user, loading: false });
      localStorage.setItem('user', JSON.stringify(user));

      // Merge local cart into server cart after login
      await useCartStore.getState().mergeCartOnLogin();
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // --- signup ---
  signup: async (data) => {
    set({ loading: true, error: null });
    try {
      const user = await signupUserApi(data);
      set({ user, loading: false });
      localStorage.setItem('user', JSON.stringify(user));

      // Merge local cart into server cart after signup
      await useCartStore.getState().mergeCartOnLogin();
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // --- logout ---
  logout: () => {
    set({ user: null });
    localStorage.removeItem('user');

    // Clear cart on logout
    useCartStore.getState().clearCartOnLogout();
  },

  // --- fetch profile ---
  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const user = await fetchUserProfileApi();
      set({ user, loading: false });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // --- role checks ---
  isAdmin: () => get().user?.role === 'admin',
  isCustomer: () => get().user?.role === 'customer',
}));
