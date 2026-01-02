// frontend/src/features/notifications/store/notificationsStore.js
import { create } from 'zustand';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notificationsApi';

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  page: 1,
  hasMore: true,
  error: null,
};

export const useNotificationsStore = create((set, get) => ({
  ...initialState,

  loadUnreadCount: async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // Exit early if token isn't written yet

    try {
      const count = await fetchUnreadCount();
      set({ unreadCount: count, error: null });
    } catch (err) {
      // Don't set error state for auth issues to prevent render loops
      if (err.response?.status !== 401 && err.message !== 'Unauthorized') {
        console.error('Failed to load unread count:', err);
        set({ error: err.message });
      }
    }
  },

  loadNotifications: async ({ reset = false } = {}) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const page = reset ? 1 : get().page;
      set({ loading: true, error: null });

      const data = await fetchNotifications({ page });

      set((state) => ({
        items: reset ? data : [...state.items, ...data],
        page: page + 1,
        hasMore: data && data.length > 0,
        loading: false,
      }));
    } catch (err) {
      set({ loading: false });
      if (err.response?.status !== 401 && err.message !== 'Unauthorized') {
        console.error('Failed to load notifications:', err);
        set({ error: err.message });
      }
    }
  },

  markRead: async (id) => {
    try {
      await markNotificationRead(id);
      set((state) => ({
        items: state.items.map((n) =>
          n._id === id ? { ...n, readAt: new Date() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  },

  markAllRead: async () => {
    try {
      await markAllNotificationsRead();
      set((state) => ({
        items: state.items.map((n) => ({ ...n, readAt: new Date() })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  },

  reset: () => set(initialState),

  pushNotification: (notification) => {
    set((state) => ({
      items: [notification, ...state.items],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
