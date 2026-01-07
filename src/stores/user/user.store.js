// frontend/src/stores/user/user.store.js
import { create } from 'zustand';
import axios from 'axios';
import {
  getProfile,
  updateProfile as updateProfileApi,
  getAddresses,
  addAddress as addAddressApi,
  updateAddress as updateAddressApi,
  deleteAddress as deleteAddressApi,
} from '@/features/user/services/userApi';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const authHeaders = () => {
  const token =
    localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const useUserDomainStore = create((set, get) => ({
  user: null,
  addresses: [],

  setUser: (user) => {
    set({ user });
  },

  resetUser: () => {
    set({ user: null, addresses: [] });
  },

  fetchProfile: async () => {
    const user = await getProfile();
    const storage = localStorage.getItem('token')
      ? localStorage
      : sessionStorage;
    storage.setItem('user', JSON.stringify(user));
    set({ user });
    return user;
  },

  updateProfile: async ({ name }) => {
    const updated = await updateProfileApi({ name });
    const storage = localStorage.getItem('token')
      ? localStorage
      : sessionStorage;
    storage.setItem('user', JSON.stringify(updated));
    set({ user: updated });
    return updated;
  },

  changePassword: async ({ oldPassword, newPassword }) => {
    await axios.put(
      `${API_BASE}/users/me/change-password`,
      { oldPassword, newPassword },
      { headers: authHeaders() }
    );
  },

  resendEmailVerification: async () => {
    await axios.post(
      `${API_BASE}/auth/email/resend`,
      {},
      { headers: authHeaders() }
    );
  },

  fetchAddresses: async () => {
    const data = await getAddresses();
    set({ addresses: data });
    return data;
  },

  addAddress: async (payload) => {
    const created = await addAddressApi(payload);
    set({ addresses: [...get().addresses, created] });
    return created;
  },

  updateAddress: async (id, payload) => {
    const updated = await updateAddressApi(id, payload);
    set({
      addresses: payload.isDefault
        ? get().addresses.map((a) =>
            a._id === id ? updated : { ...a, isDefault: false }
          )
        : get().addresses.map((a) => (a._id === id ? updated : a)),
    });
    return updated;
  },

  deleteAddress: async (id) => {
    await deleteAddressApi(id);
    set({ addresses: get().addresses.filter((a) => a._id !== id) });
  },

  needsEmailVerification: () => get().user?.emailVerified === false,
  isAdmin: () => get().user?.role === 'admin',
  isCustomer: () => get().user?.role === 'customer',
}));
