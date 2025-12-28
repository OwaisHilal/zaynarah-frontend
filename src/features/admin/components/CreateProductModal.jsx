import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function CreateProductModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE}/products`,
        {
          title: form.title,
          price: form.price !== '' ? Number(form.price) : undefined,
          stock: form.stock !== '' ? Number(form.stock) : undefined,
          description: form.description || undefined,
          images: form.imageUrl ? [form.imageUrl] : [],
          category: form.category || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      onCreated();
      onClose();
    } catch {
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Card className="w-full max-w-md p-6 bg-white">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Create product
        </h2>

        <div className="flex flex-col gap-3 text-sm">
          <input
            className="border rounded-md px-3 py-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="border rounded-md px-3 py-2"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            className="border rounded-md px-3 py-2"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />

          <input
            className="border rounded-md px-3 py-2"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            className="border rounded-md px-3 py-2"
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <textarea
            className="border rounded-md px-3 py-2 resize-none"
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={loading || !form.title} onClick={submit}>
            Create
          </Button>
        </div>
      </Card>
    </div>
  );
}
