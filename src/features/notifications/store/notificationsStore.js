//frontend/src/features/notifications/store/notificationsStore.js

import { create } from 'zustand';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notificationsApi';

export const useNotificationsStore = create((set, get) => ({
  items: [],
  unreadCount: 0,
  loading: false,
  page: 1,
  hasMore: true,

  loadUnreadCount: async () => {
    const count = await fetchUnreadCount();
    set({ unreadCount: count });
  },

  loadNotifications: async ({ reset = false } = {}) => {
    const page = reset ? 1 : get().page;
    set({ loading: true });

    const data = await fetchNotifications({ page });

    set((state) => ({
      items: reset ? data : [...state.items, ...data],
      page: page + 1,
      hasMore: data.length > 0,
      loading: false,
    }));
  },

  markRead: async (id) => {
    await markNotificationRead(id);
    set((state) => ({
      items: state.items.map((n) =>
        n._id === id ? { ...n, readAt: new Date() } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllRead: async () => {
    await markAllNotificationsRead();
    set((state) => ({
      items: state.items.map((n) => ({ ...n, readAt: new Date() })),
      unreadCount: 0,
    }));
  },

  reset: () => {
    set({
      items: [],
      unreadCount: 0,
      page: 1,
      hasMore: true,
    });
  },

  pushNotification: (notification) => {
    set((state) => ({
      items: [notification, ...state.items],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
