// frontend/src/features/reviews/components/ProductReviews.jsx
import AverageRating from './AverageRating';
import RatingBreakdown from './RatingBreakdown';
import ReviewsList from './ReviewsList';
import WriteReviewModal from './WriteReviewModal';
import useReviewActions from '../hooks/useReviewActions';

export default function ProductReviews({ productId }) {
  const { openWriteModal } = useReviewActions(productId);

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center">
        <AverageRating productId={productId} />
        <button onClick={openWriteModal}>Write a review</button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ReviewsList productId={productId} />
        </div>
        <aside>
          <RatingBreakdown productId={productId} />
        </aside>
      </div>

      <WriteReviewModal productId={productId} />
    </section>
  );
}
