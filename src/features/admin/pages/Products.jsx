// src/features/admin/pages/Products.jsx

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CreateProductModal from '../components/product/CreateProductModal';
import EditProductModal from '../components/product/EditProductModal';
import { ProductFilters } from '../components/product/ProductFilters';
import { ProductTable } from '../components/product/ProductTable';
import { Pagination } from '../components/Pagination';
import { Button } from '@/components/ui/button';
import { useProductsQuery } from '../hooks/useProductsQuery';
import { useProductsStore } from '../stores/productsStore';
import {
  useDeleteProduct,
  useBulkDeleteProducts,
} from '../hooks/useProductMutations';

const SEARCH_DEBOUNCE_MS = 400;

export default function Products() {
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);

  const {
    page,
    category,
    searchInput,
    search,
    selectedIds,
    setPage,
    setSearchInput,
    applySearch,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
  } = useProductsStore();

  const { queryKey, queryFn, keepPreviousData } = useProductsQuery({
    page,
    category,
    search,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn,
    keepPreviousData,
  });

  const deleteMutation = useDeleteProduct();
  const bulkDeleteMutation = useBulkDeleteProducts();

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    const t = setTimeout(() => {
      applySearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [searchInput, applySearch]);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return;
    deleteMutation.mutate(id);
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;

    if (
      !window.confirm(
        `Delete ${selectedIds.length} products? This cannot be undone.`
      )
    )
      return;

    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => clearSelection(),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Products</h1>
          <p className="text-sm text-neutral-500">
            Manage your catalog and inventory
          </p>
        </div>
        {isFetching && (
          <span className="text-xs text-neutral-400">Updating…</span>
        )}
      </div>

      <ProductFilters />

      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-md px-4 py-2">
          <span className="text-sm text-neutral-600">
            {selectedIds.length} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={bulkDeleteMutation.isLoading}
          >
            {bulkDeleteMutation.isLoading ? 'Deleting…' : 'Delete selected'}
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="p-8 text-center text-neutral-500 italic">
          Loading products…
        </div>
      ) : (
        <ProductTable
          products={products}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onEdit={setEditing}
          onDelete={handleDelete}
          deletingId={deleteMutation.variables}
        />
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {showCreate && (
        <CreateProductModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setPage(1);
            clearSelection();
          }}
        />
      )}

      {editing && (
        <EditProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onUpdated={() => setEditing(null)}
        />
      )}
    </div>
  );
}
