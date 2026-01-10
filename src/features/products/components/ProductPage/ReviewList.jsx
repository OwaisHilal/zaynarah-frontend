// frontend/src/features/products/components/ProductPage/ReviewList.jsx
import React, { useEffect, useRef } from 'react';
import { useReviewsStore, useReviewsUiStore } from '@/stores/reviews';
import ReviewItem from './ReviewItem';

const EMPTY_ARRAY = [];

export default function ReviewList({ productId }) {
  const currentPage = useReviewsUiStore((s) => s.currentPage);
  const currentSort = useReviewsUiStore((s) => s.currentSort);

  const fetchReviews = useReviewsStore((s) => s.fetchReviews);

  const pageIds = useReviewsStore(
    (s) => s.byProduct[productId]?.pages?.[currentPage] ?? EMPTY_ARRAY
  );

  const loading = useReviewsStore(
    (s) => s.loading[`${productId}_${currentPage}_${currentSort}`]
  );

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetchReviews({
      productId,
      page: currentPage,
      sort: currentSort,
    });
  }, [productId, currentPage, currentSort, fetchReviews]);

  if (loading) return <div>Loading reviews...</div>;
  if (!pageIds.length) return <div>No reviews yet.</div>;

  return (
    <div className="space-y-4">
      {pageIds.map((id) => (
        <ReviewItem key={id} id={id} />
      ))}
    </div>
  );
}
