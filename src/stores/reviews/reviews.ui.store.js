// frontend/src/stores/reviews/reviews.ui.store.js
import { create } from 'zustand';

const useReviewsUiStore = create((set, get) => ({
  pageByProduct: {},
  sortByProduct: {},
  writeModalFor: null,

  getPage: (id) => get().pageByProduct[id] || 1,
  getSort: (id) => get().sortByProduct[id] || 'newest',

  setPage: (id, page) =>
    set((s) => ({ pageByProduct: { ...s.pageByProduct, [id]: page } })),

  setSort: (id, sort) =>
    set((s) => ({
      sortByProduct: { ...s.sortByProduct, [id]: sort },
      pageByProduct: { ...s.pageByProduct, [id]: 1 },
    })),

  openWriteModal: (id) => set({ writeModalFor: id }),
  closeWriteModal: () => set({ writeModalFor: null }),
}));

export default useReviewsUiStore;
