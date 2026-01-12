// src/stores/wishlist/wishlist.store.js
import { create } from 'zustand';

const STORAGE_KEY = 'zaynarah_wishlist';

const readGuestWishlist = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeGuestWishlist = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const useWishlistDomainStore = create((set, get) => ({
  items: [],
  hydrated: false,

  hydrate: async () => {
    const guestItems = readGuestWishlist();
    set({ items: guestItems, hydrated: true });
  },

  has: (productId) => {
    return get().items.some((i) => i.productId === productId);
  },

  add: (product) => {
    const exists = get().items.some((i) => i.productId === product.productId);
    if (exists) return;

    const next = [...get().items, product];
    set({ items: next });
    writeGuestWishlist(next);
  },

  remove: (productId) => {
    const next = get().items.filter((i) => i.productId !== productId);
    set({ items: next });
    writeGuestWishlist(next);
  },

  toggle: (product) => {
    const exists = get().items.some((i) => i.productId === product.productId);
    if (exists) {
      get().remove(product.productId);
    } else {
      get().add(product);
    }
  },

  resetToGuest: () => {
    const guestItems = readGuestWishlist();
    set({ items: guestItems });
  },

  mergeOnLogin: async () => {
    const guestItems = readGuestWishlist();
    if (!guestItems.length) return;

    set({ items: guestItems });
    writeGuestWishlist([]);
  },
}));
