// frontend/src/features/reviews/components/WriteReviewModal.jsx
import { useState } from 'react';
import useReviewActions from '../hooks/useReviewActions';
import { useReviewsUiStore } from '@/stores/reviews';
import { useUserDomainStore } from '@/stores/user';

export default function WriteReviewModal({ productId }) {
  const openFor = useReviewsUiStore((s) => s.writeModalFor);
  const { createReview, closeWriteModal } = useReviewActions(productId);
  const user = useUserDomainStore((s) => s.user);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [err, setErr] = useState(null);

  if (openFor !== productId) return null;

  async function submit(e) {
    e.preventDefault();
    if (!user) return setErr('Login required');

    try {
      await createReview({ rating, title, body });
      closeWriteModal();
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <select value={rating} onChange={(e) => setRating(+e.target.value)}>
        {[5, 4, 3, 2, 1].map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>

      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} />

      {err && <div className="text-red-500">{err}</div>}
      <button type="submit">Submit</button>
    </form>
  );
}
