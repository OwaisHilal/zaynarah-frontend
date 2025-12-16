// src/features/products/components/ProductFilters.jsx
export default function ProductFilters({
  categories = [],
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  onReset,
}) {
  return (
    <div className="space-y-8 py-6">
      <div>
        <p className="text-sm font-medium mb-3">Category</p>
        <div className="flex flex-wrap gap-2">
          {['', ...categories].map((c) => (
            <button
              key={c || 'all'}
              onClick={() => onCategoryChange(c)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                selectedCategory === c
                  ? 'bg-bg-secondary border-border'
                  : 'hover:bg-bg-secondary'
              }`}
            >
              {c || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">
          Maximum Price: ₹{priceRange.value}
        </p>
        <input
          type="range"
          min="0"
          max={priceRange.max}
          value={priceRange.value}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        onClick={onReset}
        className="text-sm underline text-text-secondary"
      >
        Reset refinements
      </button>
    </div>
  );
}
