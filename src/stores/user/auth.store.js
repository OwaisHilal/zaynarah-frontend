// frontend/src/stores/user/auth.store.js
import { create } from 'zustand';
import { loginUser, signupUser } from '@/features/user/services/userApi';
import { disconnectNotificationsSSE } from '@/features/notifications/services/notificationsSse';
import { useUserDomainStore } from './user.store';

let loginRequestId = 0;

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
  hydrated: false,

  hydrateSession: () => {
    const storage = getAuthStorage();

    try {
      if (storage) {
        const user = JSON.parse(storage.getItem('user'));
        if (user) {
          useUserDomainStore.getState().setUser(user);
        }
      }
    } catch {}

    set({ hydrated: true });
  },

  isAuthenticated: () => {
    return !!useUserDomainStore.getState().user;
  },

  login: async ({ email, password, rememberMe }) => {
    const requestId = ++loginRequestId;
    set({ loading: true, error: '' });

    try {
      clearAuthStorage();
      const data = await loginUser({ email, password });

      if (requestId !== loginRequestId) return;
      if (!data?.token || !data?.user) return;

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', data.token);
      storage.setItem('user', JSON.stringify(data.user));

      useUserDomainStore.getState().setUser(data.user);
    } catch (err) {
      if (requestId === loginRequestId) {
        set({ error: err?.response?.data?.message || 'Login failed' });
      }
    } finally {
      if (requestId === loginRequestId) {
        set({ loading: false });
      }
    }
  },

  signup: async (payload) => {
    set({ loading: true, error: '' });

    try {
      clearAuthStorage();
      const data = await signupUser(payload);

      if (!data?.token || !data?.user) return;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      useUserDomainStore.getState().setUser(data.user);
    } catch (err) {
      set({ error: err?.response?.data?.message || 'Signup failed' });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    loginRequestId++;
    disconnectNotificationsSSE();
    clearAuthStorage();
    useUserDomainStore.getState().resetUser();
    set({ loading: false, error: '', hydrated: true });
  },
}));
