// frontend/src/features/reviews/hooks/useReviewActions.js
import { useReviewsStore, useReviewsUiStore } from '@/stores/reviews';

export default function useReviewActions(productId) {
  const createReview = useReviewsStore((s) => s.createReview);
  const removeReview = useReviewsStore((s) => s.removeReview);
  const refreshProduct = useReviewsStore((s) => s.refreshProduct);

  const openWriteModal = useReviewsUiStore((s) => s.openWriteModal);
  const closeWriteModal = useReviewsUiStore((s) => s.closeWriteModal);

  return {
    openWriteModal: () => openWriteModal(productId),
    closeWriteModal,

    createReview: (payload) => createReview({ productId, ...payload }),

    removeReview: (reviewId) => removeReview({ productId, reviewId }),

    refresh: () => refreshProduct(productId),
  };
}
