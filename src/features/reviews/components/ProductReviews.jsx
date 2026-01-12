// frontend/src/features/reviews/components/ProductReviews.jsx
import AverageRating from './AverageRating';
import RatingBreakdown from './RatingBreakdown';
import ReviewsList from './ReviewsList';
import WriteReviewModal from './WriteReviewModal';
import useReviewActions from '../hooks/useReviewActions';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function ProductReviews({ productId }) {
  const { openWriteModal } = useReviewActions(productId);

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <AverageRating productId={productId} />
        <Button onClick={openWriteModal}>Write a review</Button>
      </div>

      <Separator />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <ReviewsList productId={productId} />
        <aside className="space-y-6">
          <div className="text-sm font-medium">Rating breakdown</div>
          <RatingBreakdown productId={productId} />
        </aside>
      </div>

      <WriteReviewModal productId={productId} />
    </section>
  );
}
