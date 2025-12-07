import React, { useState } from 'react';

const ROSE_GOLD = '#B76E79';
const DEEP = '#0A0A0A';

function Stars({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f-${i}`} className="text-yellow-500">
          ★
        </span>
      ))}
      {half && <span className="text-yellow-500">☆</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e-${i}`} className="text-yellow-300">
          ☆
        </span>
      ))}
    </div>
  );
}

export default function ProductDetails({ product }) {
  // Generate reviews count only once when component mounts
  const [reviewsCount] = useState(() => Math.floor(Math.random() * 40) + 5);

  return (
    <div>
      <h1
        className="text-3xl md:text-4xl font-serif font-semibold mb-2"
        style={{ color: DEEP }}
      >
        {product?.title}
      </h1>

      <div className="flex items-center gap-4 mb-4">
        <div>
          <div
            className="text-2xl md:text-3xl font-bold"
            style={{ color: ROSE_GOLD }}
          >
            ₹{product?.price}
          </div>
          <div className="text-xs text-gray-500">Inclusive of taxes</div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Stars rating={product?.rating} />
          <div className="text-sm text-gray-500">({reviewsCount})</div>
        </div>
      </div>

      <p className="text-gray-700 mb-6 leading-relaxed">
        {product?.description}
      </p>
    </div>
  );
}
