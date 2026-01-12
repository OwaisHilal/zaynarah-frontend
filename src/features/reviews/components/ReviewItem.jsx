// frontend/src/features/reviews/components/ReviewItem.jsx
import { useReviewsStore } from '@/stores/reviews';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ReviewItem({ reviewId }) {
  const review = useReviewsStore((s) => s.byId[reviewId]);

  if (!review) return null;

  return (
    <article className="rounded-xl bg-background p-6 shadow-sm border border-border/40">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="font-medium">{review.title}</div>
            {review.isVerifiedPurchase && (
              <Badge variant="secondary">Verified purchase</Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < review.rating
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
        <time className="text-xs text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString()}
        </time>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-foreground/90">
        {review.body}
      </p>
    </article>
  );
}
