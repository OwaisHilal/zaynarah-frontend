// frontend/src/features/reviews/components/RatingBreakdown.jsx
import useReviewMeta from '../hooks/useReviewMeta';

export default function RatingBreakdown({ productId }) {
  const { ratingCounts, totalReviews, setSort } = useReviewMeta(productId);

  return (
    <div className="space-y-3">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = ratingCounts[star] || 0;
        const pct = totalReviews ? (count / totalReviews) * 100 : 0;

        return (
          <button
            key={star}
            onClick={() => setSort('highestRated')}
            className="flex items-center gap-3 w-full text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            aria-label={`${star} star reviews`}
          >
            <span className="w-8 text-muted-foreground">{star}★</span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-amber-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-8 text-right text-muted-foreground">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
