// frontend/src/features/reviews/components/ReviewsList.jsx
import ReviewItem from './ReviewItem';
import useProductReviews from '../hooks/useProductReviews';

export default function ReviewsList({ productId }) {
  const { ids, loading } = useProductReviews(productId);

  if (loading) return <div>Loading reviews…</div>;
  if (!ids.length) return <div>No reviews yet.</div>;

  return (
    <div className="space-y-4">
      {ids.map((id) => (
        <ReviewItem key={id} reviewId={id} productId={productId} />
      ))}
    </div>
  );
}
