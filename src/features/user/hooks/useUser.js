// src/features/user/hooks/useUser.js
import { create } from 'zustand';
import axios from 'axios';
import { useCartStore } from '../../cart/hooks/cartStore';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// -----------------------
// API HELPERS
// -----------------------
const authenticated = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// AUTH
const loginUserApi = async ({ email, password }) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data; // { user, token }
};

const signupUserApi = async ({ name, email, password }) => {
  const res = await axios.post(`${API_BASE}/auth/register`, {
    name,
    email,
    password,
  });
  return res.data;
};

const fetchUserProfileApi = async () => {
  const res = await axios.get(`${API_BASE}/users/me`, {
    headers: authenticated(),
  });
  return res.data; // { user }
};

// ADDRESSES
const getAddressesApi = async () => {
  const res = await axios.get(`${API_BASE}/users/addresses`, {
    headers: authenticated(),
  });
  return res.data; // { addresses }
};

const addAddressApi = async (data) => {
  const res = await axios.post(`${API_BASE}/users/addresses`, data, {
    headers: authenticated(),
  });
  return res.data; // { address }
};

const updateAddressApi = async (id, data) => {
  const res = await axios.put(`${API_BASE}/users/addresses/${id}`, data, {
    headers: authenticated(),
  });
  return res.data; // { address }
};

const deleteAddressApi = async (id) => {
  const res = await axios.delete(`${API_BASE}/users/addresses/${id}`, {
    headers: authenticated(),
  });
  return res.data;
};

// -----------------------
// ZUSTAND STORE
// -----------------------
export const useUserStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,
  addresses: [],

  // -----------------------
  // AUTH: LOGIN
  // -----------------------
  login: async (credentials) => {
    set({ loading: true, error: null });

    try {
      const { user, token } = await loginUserApi(credentials);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, loading: false });

      // merge cart
      await useCartStore.getState().mergeCartOnLogin();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Login failed',
        loading: false,
      });
    }
  },

  // -----------------------
  // AUTH: SIGNUP
  // -----------------------
  signup: async (data) => {
    set({ loading: true, error: null });

    try {
      const { user, token } = await signupUserApi(data);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, loading: false });

      await useCartStore.getState().mergeCartOnLogin();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Signup failed',
        loading: false,
      });
    }
  },

  // -----------------------
  // LOGOUT
  // -----------------------
  logout: () => {
    set({ user: null, addresses: [] });
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    useCartStore.getState().clearCartOnLogout();
  },

  // -----------------------
  // PROFILE
  // -----------------------
  fetchProfile: async () => {
    set({ loading: true, error: null });

    try {
      const { user } = await fetchUserProfileApi();

      localStorage.setItem('user', JSON.stringify(user));

      set({ user, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to load profile',
        loading: false,
      });
    }
  },

  // -----------------------
  // ADDRESS CRUD
  // -----------------------
  fetchAddresses: async () => {
    try {
      const { addresses } = await getAddressesApi();
      set({ addresses });
    } catch (err) {
      set({ error: 'Failed to fetch addresses' });
    }
  },

  addAddress: async (data) => {
    try {
      const { address } = await addAddressApi(data);
      set({ addresses: [...get().addresses, address] });
    } catch (err) {
      set({ error: 'Failed to add address' });
    }
  },

  updateAddress: async (id, data) => {
    try {
      const { address } = await updateAddressApi(id, data);

      set({
        addresses: get().addresses.map((a) => (a._id === id ? address : a)),
      });
    } catch (err) {
      set({ error: 'Failed to update address' });
    }
  },

  deleteAddress: async (id) => {
    try {
      await deleteAddressApi(id);

      set({
        addresses: get().addresses.filter((a) => a._id !== id),
      });
    } catch (err) {
      set({ error: 'Failed to delete address' });
    }
  },

  // -----------------------
  // ROLE HELPERS
  // -----------------------
  isAdmin: () => get().user?.role === 'admin',
  isCustomer: () => get().user?.role === 'customer',
}));
