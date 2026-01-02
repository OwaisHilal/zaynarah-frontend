// frontend/src/features/admin/stores/adminNotificationsStore.js
import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : null;
};

export const useAdminNotificationsStore = create((set, get) => ({
  items: [],
  unreadCount: 0,
  loading: false,

  fetchUnreadCount: async () => {
    const headers = authHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`${API_BASE}/notifications/unread-count`, {
        headers,
      });
      if (res.status === 401) return;
      const data = await res.json();
      set({ unreadCount: data.count });
    } catch (err) {
      console.error('Failed to fetch admin unread count', err);
    }
  },

  fetchLatest: async () => {
    const headers = authHeaders();
    if (!headers) return;

    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE}/notifications?limit=8`, { headers });
      if (res.status === 401) {
        set({ loading: false });
        return;
      }
      const data = await res.json();
      set({ items: data, loading: false });
    } catch (err) {
      set({ loading: false });
      console.error('Failed to fetch latest admin notifications', err);
    }
  },

  markRead: async (id) => {
    const headers = authHeaders();
    if (!headers) return;

    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'POST',
        headers,
      });

      set((state) => ({
        items: state.items.map((n) =>
          n._id === id ? { ...n, readAt: new Date() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (err) {
      console.error('Failed to mark admin notification as read', err);
    }
  },

  markAllRead: async () => {
    const headers = authHeaders();
    if (!headers) return;

    try {
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'POST',
        headers,
      });

      set((state) => ({
        items: state.items.map((n) => ({ ...n, readAt: new Date() })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error('Failed to mark all admin notifications as read', err);
    }
  },

  pushNotification: (notification) => {
    set((state) => ({
      items: [notification, ...state.items],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
