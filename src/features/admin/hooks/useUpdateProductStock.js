// src/features/admin/hooks/useUpdateProductStock.js

import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

async function updateStock({ id, stock }) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ stock }),
  });

  if (!res.ok) {
    throw new Error('Failed to update stock');
  }

  return res.json();
}

export function useUpdateProductStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStock,

    onMutate: async ({ id, stock }) => {
      await queryClient.cancelQueries({
        queryKey: ['admin', 'products'],
      });

      const previous = queryClient.getQueriesData({
        queryKey: ['admin', 'products'],
      });

      previous.forEach(([key, data]) => {
        if (!data) return;

        queryClient.setQueryData(key, {
          ...data,
          products: data.products.map((p) =>
            p._id === id ? { ...p, stock } : p
          ),
        });
      });

      return { previous };
    },

    onError: (_, __, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'products'],
      });
    },
  });
}
