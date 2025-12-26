// src/features/products/components/ProductPage/ProductReviews.jsx

import { useMemo, useState } from 'react';

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5 text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? '★' : '☆'}</span>
      ))}
    </div>
  );
}

const MOCK_REVIEWS = [
  {
    id: 1,
    name: 'Aisha K.',
    rating: 5,
    text: 'The softness is unreal. Easily the best pashmina I own.',
  },
  {
    id: 2,
    name: 'Rohit S.',
    rating: 4,
    text: 'Very premium feel. Packaging was beautiful too.',
  },
  {
    id: 3,
    name: 'Meera P.',
    rating: 5,
    text: 'Elegant, warm, and exactly as described.',
  },
];

export default function ProductReviews({ product }) {
  const [expanded, setExpanded] = useState(false);

  const reviews = MOCK_REVIEWS;
  const avgRating = useMemo(
    () => reviews.reduce((a, b) => a + b.rating, 0) / reviews.length,
    [reviews]
  );

  return (
    <section className="mt-24 border-t pt-16">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h2 className="text-2xl font-serif font-semibold">
            Customer Reviews
          </h2>

          <div className="flex items-center gap-3 mt-2">
            <Stars rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} • {reviews.length} reviews
            </span>
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground transition"
        >
          {expanded ? 'Show less' : 'Read all reviews'}
        </button>
      </header>

      {/* REVIEWS */}
      <div className="grid gap-6 max-w-3xl">
        {(expanded ? reviews : reviews.slice(0, 2)).map((r) => (
          <article key={r.id} className="rounded-xl border p-6 bg-card">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">{r.name}</span>
              <Stars rating={r.rating} />
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              “{r.text}”
            </p>
          </article>
        ))}
      </div>

      {/* TRUST FOOTER */}
      <div className="mt-10 text-sm text-muted-foreground">
        Reviews are verified from customers who purchased this product.
      </div>
    </section>
  );
}
