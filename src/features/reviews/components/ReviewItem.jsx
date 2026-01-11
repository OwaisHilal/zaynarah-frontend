// frontend/src/features/reviews/components/ReviewItem.jsx
import { useReviewsStore } from '@/stores/reviews';

export default function ReviewItem({ reviewId }) {
  const review = useReviewsStore((s) => s.byId[reviewId]);

  if (!review) return null;

  return (
    <div className="p-4 border rounded">
      <div className="flex justify-between">
        <div className="font-semibold">{review.title}</div>
        <div className="text-xs">
          {new Date(review.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="mt-2 text-sm">{review.body}</div>

      {review.isVerifiedPurchase && (
        <div className="mt-2 text-xs">Verified buyer</div>
      )}
    </div>
  );
}
