// frontend/src/features/reviews/components/AverageRating.jsx
import useReviewMeta from '../hooks/useReviewMeta';
import { Star } from 'lucide-react';

export default function AverageRating({ productId }) {
  const { avgRating, totalReviews } = useReviewMeta(productId);

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-3">
        <div className="text-4xl font-serif font-semibold tracking-tight">
          {avgRating.toFixed(1)}
        </div>
        <div className="flex items-center gap-1 pb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(avgRating)
                  ? 'fill-amber-500 text-amber-500'
                  : 'text-muted-foreground'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Based on {totalReviews} verified reviews
      </div>
    </div>
  );
}
