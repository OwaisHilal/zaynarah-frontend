import { create } from 'zustand';

export const useNotificationsDomainStore = create((set, get) => ({
  items: [],
  page: 1,
  hasMore: true,
  hydrated: false,
  hydrate: (items) => {
    set({
      items,
      page: 2,
      hasMore: items.length === 20,
      hydrated: true,
    });
  },
  append: (items) => {
    set({
      items: [...get().items, ...items],
      page: get().page + 1,
      hasMore: items.length === 20,
    });
  },
  insertFromSSE: (notification) => {
    const exists = get().items.some((n) => n._id === notification._id);
    if (exists) return;
    set({ items: [notification, ...get().items] });
  },
  markOneRead: (id) => {
    set({
      items: get().items.map((n) =>
        n._id === id ? { ...n, readAt: new Date().toISOString() } : n
      ),
    });
  },
  markAllRead: () => {
    set({
      items: get().items.map((n) =>
        n.readAt ? n : { ...n, readAt: new Date().toISOString() }
      ),
    });
  },
  reset: () => {
    set({
      items: [],
      page: 1,
      hasMore: true,
      hydrated: false,
    });
  },
  unreadCount: () => get().items.filter((n) => !n.readAt).length,
}));
