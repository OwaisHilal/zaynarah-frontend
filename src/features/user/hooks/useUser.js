// src/features/user/hooks/useUser.js
import { create } from 'zustand';
import axios from 'axios';
import { useCartStore } from '../../cart/hooks/cartStore';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const useUserStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,
  addresses: [],

  /* =====================
     AUTH
  ====================== */
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, credentials);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      set({ user: data.user, loading: false });
      await useCartStore.getState().mergeCartOnLogin();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Login failed',
        loading: false,
      });
    }
  },

  signup: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, data);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      set({ user: res.data.user, loading: false });
      await useCartStore.getState().mergeCartOnLogin();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Signup failed',
        loading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, addresses: [] });
    useCartStore.getState().clearCartOnLogout();
  },

  /* =====================
     PROFILE
  ====================== */
  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_BASE}/users/me`, {
        headers: authHeaders(),
      });

      localStorage.setItem('user', JSON.stringify(res.data));
      set({ user: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to load profile',
        loading: false,
      });
    }
  },

  updateProfile: async ({ name, email }) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(
        `${API_BASE}/users/me`,
        { name, email },
        { headers: authHeaders() }
      );

      localStorage.setItem('user', JSON.stringify(res.data));
      set({ user: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Profile update failed',
        loading: false,
      });
      throw err;
    }
  },

  changePassword: async ({ oldPassword, newPassword }) => {
    await axios.put(
      `${API_BASE}/users/me/change-password`,
      { oldPassword, newPassword },
      { headers: authHeaders() }
    );
  },

  /* =====================
     ADDRESSES
  ====================== */
  fetchAddresses: async () => {
    try {
      const res = await axios.get(`${API_BASE}/users/addresses`, {
        headers: authHeaders(),
      });
      set({ addresses: res.data });
    } catch {
      set({ error: 'Failed to fetch addresses' });
    }
  },

  addAddress: async (data) => {
    const res = await axios.post(`${API_BASE}/users/addresses`, data, {
      headers: authHeaders(),
    });
    set({ addresses: [...get().addresses, res.data] });
  },

  updateAddress: async (id, data) => {
    const res = await axios.put(`${API_BASE}/users/addresses/${id}`, data, {
      headers: authHeaders(),
    });
    set({
      addresses: get().addresses.map((a) => (a._id === id ? res.data : a)),
    });
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

  /* =====================
     ROLE HELPERS
  ====================== */
  isAdmin: () => get().user?.role === 'admin',
  isCustomer: () => get().user?.role === 'customer',
}));
