// src/features/admin/pages/Products.jsx
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CreateProductModal from '../components/product/CreateProductModal';
import EditProductModal from '../components/product/EditProductModal';
import { ProductFilters } from '../components/product/ProductFilters';
import { ProductTable } from '../components/product/ProductTable';
import { Pagination } from '../components/Pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProductsQuery } from '../hooks/useProductsQuery';
import { useProductsStore } from '../stores/productsStore';
import {
  useDeleteProduct,
  useBulkDeleteProducts,
} from '../hooks/useProductMutations';
import {
  Loader2,
  Trash2,
  AlertCircle,
  Package,
  Layers,
  CheckCircle2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const handleDelete = (id) => {};

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {' '}
      {/* Header Section */}{' '}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {' '}
        <div className="space-y-1">
          {' '}
          <div className="flex items-center gap-2">
            {' '}
            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />{' '}
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
              Inventory Engine
            </span>{' '}
          </div>{' '}
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            {' '}
            Products Catalog{' '}
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
            )}{' '}
          </h1>{' '}
          <p className="text-slate-500 font-medium">
            Manage SKUs, stock levels, and category placements.
          </p>{' '}
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="h-10 px-4 rounded-xl border-slate-200 bg-white text-slate-600 font-bold hidden sm:flex"
          >
            {data?.totalProducts || 0} Total Products
          </Badge>
        </div>
      </div>
      {/* Filter Toolbar */}
      <div className="relative z-10">
        <ProductFilters onAddClick={() => setShowCreate(true)} />
      </div>
      {/* Bulk Action Bar - Power Mode */}
      {selectedIds.length > 0 && (
        <div className="sticky top-20 z-20 flex items-center justify-between bg-slate-900 text-white rounded-[20px] px-6 py-4 shadow-2xl shadow-indigo-200 animate-in slide-in-from-top-4 duration-300 ring-4 ring-white">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-sm font-black leading-none">
                {selectedIds.length} Products Selected
              </p>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                Available action: Permanent Deletion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-white hover:bg-white/10 rounded-xl font-bold text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation.isLoading}
              className="bg-rose-600 hover:bg-rose-700 text-white border-none rounded-xl px-6 font-black text-xs h-10 shadow-lg shadow-rose-900/20"
            >
              {bulkDeleteMutation.isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-3.5 w-3.5 mr-2" />
              )}
              Delete Selection
            </Button>
          </div>
        </div>
      )}
      {/* Main Table Content */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden ring-1 ring-slate-200">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
              <Package
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600/20"
                size={16}
              />
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
              Querying Inventory...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center px-4">
            <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
              <Layers size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              No products found
            </h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              Try adjusting your filters or search terms to find what you're
              looking for.
            </p>
            <Button
              variant="link"
              onClick={() => setSearchInput('')}
              className="mt-4 text-indigo-600 font-bold"
            >
              Clear all filters
            </Button>
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
      </div>
      {/* Footer / Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-12">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Showing Page {page} of {totalPages}
        </p>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
      {/* Modals */}
      {showCreate && (
        <CreateProductModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setPage(1);
            clearSelection();
            setShowCreate(false);
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
