// frontend/src/features/reviews/hooks/useProductReviews.js
import { useEffect } from 'react';
import { useReviewsStore, useReviewsUiStore } from '@/stores/reviews';

const EMPTY = [];

export default function useProductReviews(productId) {
  const page = useReviewsUiStore((s) => s.getPage(productId));
  const sort = useReviewsUiStore((s) => s.getSort(productId));

  const fetchReviews = useReviewsStore((s) => s.fetchReviews);

  const ids = useReviewsStore(
    (s) => s.byProduct[productId]?.pages?.[page] || EMPTY
  );

  const meta = useReviewsStore((s) => s.byProduct[productId]?.meta);

  const loading = useReviewsStore(
    (s) => s.loading[`${productId}|${page}|10|${sort}`]
  );

  const error = useReviewsStore(
    (s) => s.error[`${productId}|${page}|10|${sort}`]
  );

  useEffect(() => {
    fetchReviews({ productId, page, sort });
  }, [productId, page, sort, fetchReviews]);

  return {
    ids,
    meta,
    page,
    sort,
    loading,
    error,
  };
}
