// frontend/src/features/products/components/ProductPage/ReviewItem.jsx
import React from 'react';
import { useReviewsStore } from '@/stores/reviews';

export default function ReviewItem({ id }) {
  const r = useReviewsStore((s) => s.byId[id]);
  if (!r) return null;

  return (
    <div className="p-4 border rounded">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{r.title || null}</div>
        <div className="text-sm">
          {new Date(r.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="text-sm mt-2">{r.body}</div>

      <div className="mt-3 text-xs">
        {r.isVerifiedPurchase ? (
          <span className="badge">Verified buyer</span>
        ) : null}
      </div>
    </div>
  );
}
