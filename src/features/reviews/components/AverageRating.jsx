// frontend/src/features/reviews/components/AverageRating.jsx
import useReviewMeta from '../hooks/useReviewMeta';

export default function AverageRating({ productId }) {
  const { avgRating, totalReviews } = useReviewMeta(productId);

  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl font-semibold">{avgRating.toFixed(1)}</div>
      <div className="text-sm text-muted-foreground">({totalReviews})</div>
    </div>
  );
}
