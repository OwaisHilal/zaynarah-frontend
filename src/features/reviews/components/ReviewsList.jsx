// frontend/src/features/reviews/components/ReviewsList.jsx
import ReviewItem from './ReviewItem';
import useProductReviews from '../hooks/useProductReviews';

export default function ReviewsList({ productId }) {
  const { ids, loading } = useProductReviews(productId);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!ids.length) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
        No reviews yet. Be the first verified buyer to share your experience.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {ids.map((id) => (
        <ReviewItem key={id} reviewId={id} />
      ))}
    </div>
  );
}
