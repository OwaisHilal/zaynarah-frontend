// producthelper.js
// Utility functions for working with products across the Zaynarah app

/**
 * Formats price into INR currency format.
 */
export function formatPrice(amount) {
  if (typeof amount !== 'number') return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generates a clean product slug from a name.
 */
export function generateSlug(name = '') {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Calculates discount percentage based on original and sale price.
 */
export function getDiscountPercentage(original, sale) {
  if (!original || !sale || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}

/**
 * Sorts products by price (low-to-high or high-to-low).
 */
export function sortProductsByPrice(products = [], order = 'asc') {
  return [...products].sort((a, b) =>
    order === 'asc' ? a.price - b.price : b.price - a.price
  );
}

/**
 * Filters products based on category.
 */
export function filterByCategory(products = [], category = '') {
  if (!category) return products;
  return products.filter((p) => p.category === category);
}

/**
 * Paginates product lists.
 */
export function paginate(products = [], page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  return products.slice(start, start + pageSize);
}
