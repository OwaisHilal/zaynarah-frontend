// frontend/src/features/products/services/productsApi.js

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const normalizeProduct = (p) => {
  if (!p) return p;
  return { ...p, id: p._id || p.id };
};

// **NEW HELPER FUNCTION:** Remove keys with undefined/null values
const cleanParams = (params) => {
  const cleaned = {};
  for (const key in params) {
    // Skip null, undefined, and empty string, UNLESS it's a zero number
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ''
    ) {
      cleaned[key] = params[key];
    }
  }
  return cleaned;
};

export const fetchProducts = async (params = {}) => {
  // Use the new cleaner before creating the query string
  const cleanedParams = cleanParams(params);
  const queryString = new URLSearchParams(cleanedParams).toString();
  const url = `${API_BASE}/products${queryString ? `?${queryString}` : ''}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      // Check if the 400 error came from the server side validation.
      throw new Error(
        `Failed to fetch products: ${res.status} ${res.statusText}`
      );
    }

    const json = await res.json();

    if (json.data && Array.isArray(json.data)) {
      return {
        data: json.data.map(normalizeProduct),
        total: json.total || 0,
        page: json.page || 1,
        totalPages: json.totalPages || 1,
      };
    }

    throw new Error(
      'Invalid products data format from server. Missing "data" key.'
    );
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      console.error(
        'CRITICAL: Network connection failed. Please ensure your backend is running and VITE_API_BASE is correct:',
        API_BASE
      );
    }
    throw error;
  }
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  const json = await res.json();
  return normalizeProduct(json);
};

export const getProducts = async (params = {}) => {
  const result = await fetchProducts(params);
  return result.data;
};
