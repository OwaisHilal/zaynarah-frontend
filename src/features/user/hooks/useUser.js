// src/features/user/hooks/useUser.js
import { create } from 'zustand';
import axios from 'axios';
import { useCartStore } from '../../cart/hooks/cartStore';
import { disconnectNotificationsSSE } from '@/features/notifications/services/notificationsSse';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

const persistUser = (user) => {
  if (user) localStorage.setItem('user', JSON.stringify(user));
  else localStorage.removeItem('user');
};

const readPersistedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
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

  setAuthState: (user) => {
    persistUser(user);
    set({
      user,
      needsEmailVerification: user?.emailVerified === false,
    });
  },

  clearAuthState: () => {
    disconnectNotificationsSSE();
    localStorage.removeItem('token');
    persistUser(null);
    set({
      user: null,
      addresses: [],
      needsEmailVerification: false,
      loading: false,
      error: '',
    });
    useCartStore.getState().clearCartOnLogout();
  },

  login: async (credentials) => {
    set({ loading: true, error: '' });
    try {
      localStorage.removeItem('token');

      const { data } = await axios.post(`${API_BASE}/auth/login`, credentials);

      localStorage.setItem('token', data.token);
      get().setAuthState(data.user);

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
      const { data } = await axios.post(`${API_BASE}/auth/register`, payload);
      localStorage.setItem('token', data.token);
      get().setAuthState(data.user);
      await useCartStore.getState().mergeCartOnLogin();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Signup failed',
      });
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
      const res = await axios.get(`${API_BASE}/users/me`, {
        headers: authHeaders(),
      });
      get().setAuthState(res.data);
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
      get().setAuthState(res.data);
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Profile update failed',
      });
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
