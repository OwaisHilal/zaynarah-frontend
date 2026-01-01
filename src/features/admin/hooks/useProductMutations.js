// src/features/admin/hooks/useProductMutations.js

import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

async function deleteProduct(id) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete product');
  }

  return id;
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onMutate: async (id) => {
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
          products: data.products.filter((p) => p._id !== id),
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

async function bulkDeleteProducts(ids) {
  const token = localStorage.getItem('token');

  await Promise.all(
    ids.map((id) =>
      fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    )
  );

  return ids;
}

export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteProducts,

    onMutate: async (ids) => {
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
          products: data.products.filter((p) => !ids.includes(p._id)),
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
