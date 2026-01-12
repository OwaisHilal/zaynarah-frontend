// frontend/src/features/reviews/components/WriteReviewModal.jsx
import { useState } from 'react';
import useReviewActions from '../hooks/useReviewActions';
import { useReviewsUiStore } from '@/stores/reviews';
import { useUserDomainStore } from '@/stores/user';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

export default function WriteReviewModal({ productId }) {
  const openFor = useReviewsUiStore((s) => s.writeModalFor);
  const { createReview, closeWriteModal } = useReviewActions(productId);
  const user = useUserDomainStore((s) => s.user);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [err, setErr] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isBodyValid = body.trim().length >= 10;

  async function submit(e) {
    e.preventDefault();
    setErr(null);

    if (!user) {
      setErr('Please log in to submit a review.');
      return;
    }

    if (!isBodyValid) {
      setErr('Review must be at least 10 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      await createReview({ rating, title, body });
      closeWriteModal();
    } catch (e) {
      setErr(e.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={openFor === productId} onOpenChange={closeWriteModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setRating(i + 1)}
                className="focus:outline-none"
                aria-label={`${i + 1} stars`}
              >
                <Star
                  className={`h-5 w-5 ${
                    i < rating
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>

          <Input
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Share your experience (minimum 10 characters)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
          />

          {err && <div className="text-sm text-destructive">{err}</div>}

          <div className="flex justify-end">
            <Button type="submit" disabled={!isBodyValid || submitting}>
              {submitting ? 'Submitting…' : 'Submit review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
