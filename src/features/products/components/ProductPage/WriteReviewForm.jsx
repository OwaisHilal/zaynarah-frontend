// frontend/src/features/products/components/ProductPage/WriteReviewForm.jsx
import React, { useState } from 'react';
import { useReviewsStore, useReviewsUiStore } from '@/stores/reviews';
import { useUserDomainStore } from '@/stores/user';

export default function WriteReviewForm({ productId }) {
  const user = useUserDomainStore((s) => s.user);
  const createReview = useReviewsStore((s) => s.createReview);
  const close = useReviewsUiStore((s) => s.closeWriteModal);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();

    if (!user) {
      setErr('Login required');
      return;
    }

    try {
      await createReview({ productId, rating, title, body });
      close();
    } catch (error) {
      setErr(error.message || 'Failed');
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm">Title (optional)</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label className="block text-sm">Review</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          minLength={10}
          maxLength={2000}
        />
      </div>

      {err ? <div className="text-red-500">{err}</div> : null}

      <div>
        <button type="submit">Submit review</button>
      </div>
    </form>
  );
}
