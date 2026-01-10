// frontend/src/stores/reviews/reviews.ui.store.js
import { create } from 'zustand';

const useReviewsUiStore = create((set) => ({
  currentPage: 1,
  currentSort: 'newest',
  isWriteModalOpen: false,
  openWriteModal: () => set({ isWriteModalOpen: true }),
  closeWriteModal: () => set({ isWriteModalOpen: false }),
  setPage: (p) => set({ currentPage: p }),
  setSort: (s) => set({ currentSort: s }),
}));

export default useReviewsUiStore;
