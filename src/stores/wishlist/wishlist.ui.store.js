// src/stores/wishlist/wishlist.ui.store.js
import { create } from 'zustand';

export const useWishlistUIStore = create((set) => ({
  loading: false,
  syncing: false,
  error: null,

  setLoading: (loading) => set({ loading }),
  setSyncing: (syncing) => set({ syncing }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      loading: false,
      syncing: false,
      error: null,
    }),
}));
