// frontend/src/features/products/components/ProductPage/ProductReviewsConnector.jsx
import React from 'react';
import AverageRating from './AverageRating';
import RatingBreakdown from './RatingBreakdown';
import ReviewList from './ReviewList';
import WriteReviewForm from './WriteReviewForm';
import { useReviewsUiStore } from '@/stores/reviews';

export default function ProductReviewsConnector({ productId }) {
  const open = useReviewsUiStore((s) => s.openWriteModal);

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <AverageRating productId={productId} />
        <button onClick={open}>Write a review</button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ReviewList productId={productId} />
        </div>
        <aside>
          <RatingBreakdown productId={productId} />
        </aside>
      </div>
    </section>
  );
}
