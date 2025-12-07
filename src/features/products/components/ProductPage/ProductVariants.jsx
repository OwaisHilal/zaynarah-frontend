// src/features/products/components/ProductPage/ProductVariants.jsx
import React from 'react';

const ROSE_GOLD = '#B76E79';

export default function ProductVariants({
  product,
  selectedVariant,
  setSelectedVariant,
  setShowSizeGuide,
}) {
  if (!product.variants?.length) return null;

  return (
    <div className="space-y-4 mb-4">
      {product.variants.map((v) => (
        <div key={v.name}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-800">{v.name}</div>
            {v.name.toLowerCase().includes('size') && (
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-xs underline text-gray-500"
              >
                Size guide
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {v.options.map((opt) => {
              const selected = selectedVariant[v.name] === opt;
              return (
                <button
                  key={opt}
                  onClick={() =>
                    setSelectedVariant((s) => ({ ...s, [v.name]: opt }))
                  }
                  className={`px-3 py-2 rounded-full border text-sm transition ${
                    selected
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-white border-gray-200 hover:shadow-sm'
                  }`}
                  aria-pressed={selected}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
