// frontend/src/features/products/components/ProductPage/AverageRating.jsx
import React from 'react';
import { useReviewsStore } from '@/stores/reviews';

export default function AverageRating({ productId }) {
  const meta = useReviewsStore(
    (state) =>
      (state.byProduct[productId] && state.byProduct[productId].meta) || null
  );

  const avg = meta ? meta.avgRating : 0;
  const total = meta ? meta.totalReviews : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl font-semibold">
        {avg ? avg.toFixed(1) : '0.0'}
      </div>

      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={i < Math.round(avg) ? 'currentColor' : 'none'}
            stroke="currentColor"
            className="mr-0"
          >
            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.73z" />
          </svg>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">({total})</div>
    </div>
  );
}
