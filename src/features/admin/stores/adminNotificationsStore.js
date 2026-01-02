import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const useAdminNotificationsStore = create((set, get) => ({
  items: [],
  unreadCount: 0,
  loading: false,

  fetchUnreadCount: async () => {
    const res = await fetch(`${API_BASE}/notifications/unread-count`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    set({ unreadCount: data.count });
  },

  fetchLatest: async () => {
    set({ loading: true });
    const res = await fetch(`${API_BASE}/notifications?limit=8`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    set({ items: data, loading: false });
  },

  markRead: async (id) => {
    await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'POST',
      headers: authHeaders(),
    });

    set((state) => ({
      items: state.items.map((n) =>
        n._id === id ? { ...n, readAt: new Date() } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllRead: async () => {
    await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'POST',
      headers: authHeaders(),
    });

    set((state) => ({
      items: state.items.map((n) => ({ ...n, readAt: new Date() })),
      unreadCount: 0,
    }));
  },

  pushNotification: (notification) => {
    set((state) => ({
      items: [notification, ...state.items],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
