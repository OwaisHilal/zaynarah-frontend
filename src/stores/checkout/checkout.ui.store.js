// src/stores/checkout/checkout.ui.store.js
import { create } from 'zustand';

export const useCheckoutUIStore = create((set, get) => ({
  currentStep: 1,
  totalSteps: 5,
  loading: false,
  error: '',

  next() {
    set((s) => ({
      currentStep: Math.min(s.currentStep + 1, s.totalSteps),
      error: '',
    }));
  },

  back() {
    set((s) => ({
      currentStep: Math.max(s.currentStep - 1, 1),
      error: '',
    }));
  },

  setLoading(v) {
    set({ loading: v });
  },

  setError(msg) {
    set({ error: msg });
  },

  reset() {
    set({
      currentStep: 1,
      loading: false,
      error: '',
    });
  },
}));
