// src/stores/products/products.store.js
import { create } from 'zustand';
import {
  fetchProducts,
  fetchProductById,
} from '@/features/products/services/productsApi';

export const useProductsDomainStore = create((set, get) => ({
  entities: {},
  ids: [],
  loading: false,
  error: null,
  pagination: { page: 1, totalPages: 1, total: 0 },

  fetchList: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await fetchProducts(params);
      const map = {};
      const ids = [];
      for (const p of res.data) {
        map[p.id] = p;
        ids.push(p.id);
      }
      set({
        entities: map,
        ids,
        pagination: {
          page: res.page,
          totalPages: res.totalPages,
          total: res.total,
        },
      });
    } catch (e) {
      set({ error: e.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchById: async (id) => {
    const existing = get().entities[id];
    if (existing) return existing;
    set({ loading: true, error: null });
    try {
      const p = await fetchProductById(id);
      set((s) => ({
        entities: { ...s.entities, [p.id]: p },
      }));
      return p;
    } catch (e) {
      set({ error: e.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));
