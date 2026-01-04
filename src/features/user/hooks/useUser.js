// src/features/user/hooks/useUser.js
import { create } from 'zustand';
import axios from 'axios';
import { useCartStore } from '../../cart/hooks/cartStore';
import { disconnectNotificationsSSE } from '@/features/notifications/services/notificationsSse';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const getAuthStorage = () => {
  if (localStorage.getItem('token')) return localStorage;
  if (sessionStorage.getItem('token')) return sessionStorage;
  return null;
};

const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const persistUser = (user, rememberMe) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('user', JSON.stringify(user));
};

const clearPersistedUser = () => {
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
};

const readPersistedUser = () => {
  const storage = getAuthStorage();
  if (!storage) return null;

  try {
    return JSON.parse(storage.getItem('user'));
  } catch {
    return null;
  }
};

export const useUserStore = create((set, get) => ({
  user: readPersistedUser(),
  addresses: [],
  loading: false,
  error: '',
  needsEmailVerification: readPersistedUser()?.emailVerified === false,

  setAuthState: (user, rememberMe) => {
    persistUser(user, rememberMe);
    set({
      user,
      needsEmailVerification: user?.emailVerified === false,
    });
  },

  clearAuthState: () => {
    disconnectNotificationsSSE();
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    clearPersistedUser();
    set({
      user: null,
      addresses: [],
      needsEmailVerification: false,
      loading: false,
      error: '',
    });
    useCartStore.getState().clearCartOnLogout();
  },

  login: async ({ email, password, rememberMe }) => {
    set({ loading: true, error: '' });
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      clearPersistedUser();

      const { data } = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', data.token);

      get().setAuthState(data.user, rememberMe);
      await useCartStore.getState().mergeCartOnLogin();
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed' });
    } finally {
      set({ loading: false });
    }
  },

  signup: async (payload) => {
    set({ loading: true, error: '' });
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      clearPersistedUser();

      const { data } = await axios.post(`${API_BASE}/auth/register`, payload);

      localStorage.setItem('token', data.token);
      persistUser(data.user, true);

      set({
        user: data.user,
        needsEmailVerification: data.user?.emailVerified === false,
      });

      await useCartStore.getState().mergeCartOnLogin();
    } catch (err) {
      set({ error: err.response?.data?.message || 'Signup failed' });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    get().clearAuthState();
  },

  fetchProfile: async () => {
    set({ loading: true, error: '' });
    try {
      const storage = getAuthStorage();
      if (!storage) throw new Error('No session');

      const res = await axios.get(`${API_BASE}/users/me`, {
        headers: authHeaders(),
      });

      storage.setItem('user', JSON.stringify(res.data));

      set({
        user: res.data,
        needsEmailVerification: res.data?.emailVerified === false,
      });
    } catch (err) {
      get().clearAuthState();
      set({
        error: err.response?.data?.message || 'Session expired',
      });
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async ({ name }) => {
    set({ loading: true, error: '' });
    try {
      const res = await axios.put(
        `${API_BASE}/users/me`,
        { name },
        { headers: authHeaders() }
      );

      const storage = getAuthStorage();
      if (storage) storage.setItem('user', JSON.stringify(res.data));

      set({ user: res.data });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Profile update failed' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  changePassword: async ({ oldPassword, newPassword }) => {
    await axios.put(
      `${API_BASE}/users/me/change-password`,
      { oldPassword, newPassword },
      { headers: authHeaders() }
    );
  },

  fetchAddresses: async () => {
    try {
      const res = await axios.get(`${API_BASE}/users/addresses`, {
        headers: authHeaders(),
      });
      set({ addresses: res.data });
    } catch {
      set({ error: 'Failed to load addresses' });
    }
  },

  addAddress: async (payload) => {
    const res = await axios.post(`${API_BASE}/users/addresses`, payload, {
      headers: authHeaders(),
    });
    set({ addresses: [...get().addresses, res.data] });
    return res.data;
  },

  updateAddress: async (id, payload) => {
    const res = await axios.put(`${API_BASE}/users/addresses/${id}`, payload, {
      headers: authHeaders(),
    });

    set({
      addresses: payload.isDefault
        ? get().addresses.map((a) =>
            a._id === id ? res.data : { ...a, isDefault: false }
          )
        : get().addresses.map((a) => (a._id === id ? res.data : a)),
    });

    return res.data;
  },

  deleteAddress: async (id) => {
    await axios.delete(`${API_BASE}/users/addresses/${id}`, {
      headers: authHeaders(),
    });
    set({
      addresses: get().addresses.filter((a) => a._id !== id),
    });
  },

  resendEmailVerification: async () => {
    try {
      await axios.post(
        `${API_BASE}/auth/email/resend`,
        {},
        { headers: authHeaders() }
      );
      return true;
    } catch {
      return false;
    }
  },

  isAdmin: () => get().user?.role === 'admin',
  isCustomer: () => get().user?.role === 'customer',
}));
