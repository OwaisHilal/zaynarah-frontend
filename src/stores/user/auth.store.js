// frontend/src/stores/user/auth.store.js
import { create } from 'zustand';
import { loginUser, signupUser } from '@/features/user/services/userApi';
import { disconnectNotificationsSSE } from '@/features/notifications/services/notificationsSse';
import { useCartStore } from '@/features/cart/hooks/cartStore';
import { useUserDomainStore } from './user.store';

const getAuthStorage = () => {
  if (localStorage.getItem('token')) return localStorage;
  if (sessionStorage.getItem('token')) return sessionStorage;
  return null;
};

const clearAuthStorage = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
};

export const useAuthStore = create((set) => ({
  loading: false,
  error: '',

  hydrateSession: () => {
    const storage = getAuthStorage();
    if (!storage) return;

    try {
      const user = JSON.parse(storage.getItem('user'));
      if (user) {
        useUserDomainStore.getState().setUser(user);
      }
    } catch {}
  },

  login: async ({ email, password, rememberMe }) => {
    set({ loading: true, error: '' });
    const cartStore = useCartStore.getState();
    const guestCart = cartStore.cart || [];

    try {
      clearAuthStorage();
      const data = await loginUser({ email, password });

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', data.token);
      storage.setItem('user', JSON.stringify(data.user));

      useUserDomainStore.getState().setUser(data.user);
      await cartStore.mergeCartOnLogin(guestCart);
    } catch (err) {
      set({ error: err?.response?.data?.message || 'Login failed' });
    } finally {
      set({ loading: false });
    }
  },

  signup: async (payload) => {
    set({ loading: true, error: '' });
    const cartStore = useCartStore.getState();
    const guestCart = cartStore.cart || [];

    try {
      clearAuthStorage();
      const data = await signupUser(payload);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      useUserDomainStore.getState().setUser(data.user);
      await cartStore.mergeCartOnLogin(guestCart);
    } catch (err) {
      set({ error: err?.response?.data?.message || 'Signup failed' });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    disconnectNotificationsSSE();
    clearAuthStorage();
    useUserDomainStore.getState().resetUser();
    useCartStore.getState().clearCartOnLogout();
    set({ loading: false, error: '' });
  },
}));
