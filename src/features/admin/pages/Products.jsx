import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import CreateProductModal from '../components/product/CreateProductModal';
import EditProductModal from '../components/product/EditProductModal';
import { ProductFilters } from '../components/product/ProductFilters';
import { ProductTable } from '../components/product/ProductTable';
import { Pagination } from '../components/Pagination';
import { Button } from '@/components/ui/button';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [category, setCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [selectedIds, setSelectedIds] = useState([]);

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const debounceRef = useRef(null);
  const firstLoadRef = useRef(true);

  const fetchProducts = useCallback(
    async (
      pageNumber = 1,
      categoryFilter = '',
      searchQuery = '',
      silent = false
    ) => {
      if (!silent) setLoading(true);

      try {
        const res = await axios.get(`${API_BASE}/products`, {
          params: {
            page: pageNumber,
            limit: PAGE_SIZE,
            ...(categoryFilter ? { category: categoryFilter } : {}),
            ...(searchQuery ? { q: searchQuery } : {}),
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        setTotalPages(res.data.totalPages || 1);
        setSelectedIds([]);
      } catch {
        setProducts([]);
        setTotalPages(1);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    []
  );

  // Initial load + page/category change
  useEffect(() => {
    const silent = !firstLoadRef.current && search !== '';
    fetchProducts(page, category, search, silent);
    firstLoadRef.current = false;
  }, [page, category, search, fetchProducts]);

  // Debounced search (NO loading spinner)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const handleCategoryChange = (val) => {
    setPage(1);
    setCategory(val);
  };

  const handleSearchChange = (val) => {
    setSearchInput(val);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id || p._id));
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE}/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (products.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchProducts(page, category, search);
      }
    } catch {
      alert('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const bulkDelete = async () => {
    if (!selectedIds.length) return;
    if (
      !window.confirm(
        `Delete ${selectedIds.length} products? This cannot be undone.`
      )
    )
      return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`${API_BASE}/products/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
        )
      );

      setSelectedIds([]);
      fetchProducts(page, category, search);
    } catch {
      alert('Bulk delete failed');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-neutral-500 italic">
        Loading products...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProductFilters
        category={category}
        search={searchInput}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        onAddClick={() => setShowCreate(true)}
      />

      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-md px-4 py-2">
          <span className="text-sm text-neutral-600">
            {selectedIds.length} selected
          </span>
          <Button variant="destructive" size="sm" onClick={bulkDelete}>
            Delete selected
          </Button>
        </div>
      )}

      <ProductTable
        products={products}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onEdit={setEditing}
        onDelete={deleteProduct}
        deletingId={deletingId}
      />

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
            fetchProducts(1, category, search);
          }}
        />
      )}

      {editing && (
        <EditProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onUpdated={() => fetchProducts(page, category, search)}
        />
      )}
    </div>
  );
}
