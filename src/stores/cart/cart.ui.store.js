// src/stores/cart/cart.ui.store.js
import { create } from 'zustand';

export const useCartUIStore = create((set) => ({
  updatingIds: [],

  startUpdating(id) {
    set((s) => ({ updatingIds: [...s.updatingIds, id] }));
  },

  stopUpdating(id) {
    set((s) => ({
      updatingIds: s.updatingIds.filter((x) => x !== id),
    }));
  },

  isUpdating(id) {
    return get().updatingIds.includes(id);
  },
}));
