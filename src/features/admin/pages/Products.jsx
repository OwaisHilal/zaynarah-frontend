import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CreateProductModal from '../components/CreateProductModal';
import EditProductModal from '../components/EditProductModal';
import { ProductFilters } from '../components/ProductFilters';
import { ProductTable } from '../components/ProductTable';
import { Pagination } from '../components/Pagination';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const PAGE_SIZE = 10;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = useCallback(
    async (pageNumber = 1, categoryFilter = '') => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/products`, {
          params: {
            page: pageNumber,
            limit: PAGE_SIZE,
            ...(categoryFilter ? { category: categoryFilter } : {}),
          },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        setTotalPages(res.data.totalPages || 1);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProducts(page, category);
  }, [page, category, fetchProducts]);

  const handleCategoryChange = (val) => {
    setPage(1);
    setCategory(val);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE}/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Refresh logic
      if (products.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchProducts(page, category);
      }
    } catch (err) {
      alert('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-neutral-500 italic">
        Loading products...
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <ProductFilters
        category={category}
        onCategoryChange={handleCategoryChange}
        onAddClick={() => setShowCreate(true)}
      />

      <ProductTable
        products={products}
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
            fetchProducts(1, category);
          }}
        />
      )}

      {editing && (
        <EditProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onUpdated={() => fetchProducts(page, category)}
        />
      )}
    </div>
  );
}
