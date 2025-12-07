// src/features/products/components/ProductFilters.jsx
import { useState, useEffect } from 'react';

/**
 * Lightweight filters UI used inside the sheet on Shop page.
 * Props expected:
 *  - categories: array of strings
 *  - selectedCategory, onCategoryChange
 *  - priceRange { max, value }, onPriceChange
 *  - onReset
 */
export default function ProductFilters({
  categories = [],
  selectedCategory,
  onCategoryChange = () => {},
  priceRange = { max: 1000, value: 1000 },
  onPriceChange = () => {},
  onReset = () => {},
}) {
  const [localMax, setLocalMax] = useState(priceRange.value);

  useEffect(() => setLocalMax(priceRange.value), [priceRange.value]);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium mb-2">Category</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === '' ? 'bg-rose-100' : 'bg-white'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === c ? 'bg-rose-100' : 'bg-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium mb-2">Max Price: ₹{localMax}</div>
        <input
          type="range"
          min="0"
          max={priceRange.max || 10000}
          value={localMax}
          onChange={(e) => {
            const v = Number(e.target.value);
            setLocalMax(v);
            onPriceChange(v);
          }}
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={onReset} className="px-4 py-2 rounded-md border">
          Reset
        </button>
      </div>
    </div>
  );
}
