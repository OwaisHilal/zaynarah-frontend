// frontend/src/features/products/components/ProductPage/RatingBreakdown.jsx
import React from 'react';
import { useReviewsStore, useReviewsUiStore } from '@/stores/reviews';

const EMPTY_COUNTS = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

export default function RatingBreakdown({ productId }) {
  const meta = useReviewsStore((state) => state.byProduct[productId]?.meta);

  const setSort = useReviewsUiStore((s) => s.setSort);

  const counts = meta?.ratingCounts ?? EMPTY_COUNTS;
  const total = meta?.totalReviews ?? 0;

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = counts[star] || 0;
        const pct = total === 0 ? 0 : Math.round((count / total) * 100);

        return (
          <div key={star} className="flex items-center gap-3">
            <div className="w-8 text-sm">{star}</div>

            <div className="flex-1 bg-gray-100 rounded h-3 overflow-hidden">
              <div style={{ width: `${pct}%` }} className="h-3" />
            </div>

            <div className="w-12 text-right text-sm">{count}</div>

            <button
              className="ml-2 text-xs"
              onClick={() => setSort('highestRated')}
            >
              Sort
            </button>
          </div>
        );
      })}
    </div>
  );
}
