// src/features/admin/hooks/useProductsQuery.js

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const PAGE_SIZE = 10;

async function fetchProducts({ page, category, search }) {
  const token = localStorage.getItem('token');

  const params = new URLSearchParams({
    page,
    limit: PAGE_SIZE,
  });

  if (category) params.append('category', category);
  if (search) params.append('q', search);

  const res = await fetch(`${API_BASE}/products?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  const json = await res.json();

  return {
    products: Array.isArray(json.data) ? json.data : [],
    totalPages: json.totalPages || 1,
  };
}

export function useProductsQuery(filters) {
  return {
    queryKey: ['admin', 'products', filters],
    queryFn: () => fetchProducts(filters),
    keepPreviousData: true,
    staleTime: 1000 * 30,
    retry: 1,
  };
}
