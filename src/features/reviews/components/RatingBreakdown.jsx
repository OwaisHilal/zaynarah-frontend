// frontend/src/features/reviews/components/RatingBreakdown.jsx
import useReviewMeta from '../hooks/useReviewMeta';

export default function RatingBreakdown({ productId }) {
  const { ratingCounts, setSort } = useReviewMeta(productId);

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((star) => (
        <button
          key={star}
          onClick={() => setSort('highestRated')}
          className="flex justify-between w-full text-sm"
        >
          <span>{star}★</span>
          <span>{ratingCounts[star] || 0}</span>
        </button>
      ))}
    </div>
  );
}
