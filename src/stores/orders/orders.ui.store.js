// frontend/src/stores/orders/orders.ui.store.js
import { create } from 'zustand';

export const useOrdersUIStore = create((set) => ({
  loading: false,
  error: null,
  selectedOrderId: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  selectOrder: (id) => set({ selectedOrderId: id }),
  clearSelection: () => set({ selectedOrderId: null }),

  reset: () =>
    set({
      loading: false,
      error: null,
      selectedOrderId: null,
    }),
}));
