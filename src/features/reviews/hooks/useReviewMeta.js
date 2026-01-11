// frontend/src/features/reviews/hooks/useReviewMeta.js
import { useReviewsStore, useReviewsUiStore } from '@/stores/reviews';

export default function useReviewMeta(productId) {
  const meta = useReviewsStore((s) => s.byProduct[productId]?.meta);

  const setSort = useReviewsUiStore((s) => s.setSort);

  return {
    avgRating: meta?.avgRating || 0,
    totalReviews: meta?.totalReviews || 0,
    ratingCounts: meta?.ratingCounts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },

    setSort: (sort) => setSort(productId, sort),
  };
}
