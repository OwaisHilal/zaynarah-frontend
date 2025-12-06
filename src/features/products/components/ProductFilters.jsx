import React from 'react';

const ProductFilters = ({
  categories = [],
  selectedCategory = '',
  onCategoryChange = () => {},
  priceRange = { max: 1000, value: 1000 },
  onPriceChange = () => {},
  onReset = () => {},
}) => {
  const { max = 1000, value = 1000 } = priceRange || {};

  return (
    <div className="space-y-6">
      {' '}
      {/* Use space-y-6 for vertical spacing in the sheet */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Quick Filters</h3>
        <button
          onClick={onReset}
          className="text-sm text-rose-600 hover:underline"
          type="button"
        >
          Reset All
        </button>
      </div>
      {/* Category Filter */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border rounded p-2 w-full focus:ring-primary focus:border-primary dark:bg-gray-800"
        >
          <option value="">All Collections</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      {/* Price Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block font-medium text-gray-700 dark:text-gray-300">
            Max Price
          </label>
          <div className="text-sm font-semibold">₹{value}</div>
        </div>

        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
        />

        <div className="flex justify-between text-xs text-gray-500 pt-1">
          <span>₹0</span>
          <span>₹{max}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
