// src/features/admin/components/product/ProductFilters.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProductsStore } from '../../stores/productsStore';
import {
  Plus,
  Search,
  X,
  ListFilter,
  PackagePlus,
  Command,
} from 'lucide-react';

export function ProductFilters({ onAddClick }) {
  const { category, searchInput, setCategory, setSearchInput } =
    useProductsStore();
  const isFiltered = category !== '' || searchInput !== '';

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-2.5 rounded-[28px] border border-slate-200 shadow-sm ring-8 ring-slate-50/50">
      <div className="relative flex-1 w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          <Search size={16} className="text-slate-400" />
        </div>
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Query SKU, Title, or Tag..."
          className="w-full h-12 border-none bg-transparent pl-12 pr-4 focus-visible:ring-0 text-sm font-bold placeholder:text-slate-400 uppercase tracking-tight"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100">
          <Command size={10} className="text-slate-400" />
          <span className="text-[9px] font-black text-slate-400 tracking-tighter">
            CTRL+K
          </span>
        </div>
      </div>

      <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />

      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="flex items-center gap-2 bg-slate-50 h-12 px-4 rounded-2xl border border-slate-100 flex-1 md:flex-none md:min-w-[200px]">
          <ListFilter size={14} className="text-indigo-500" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent text-[10px] font-black text-slate-600 uppercase tracking-widest outline-none w-full cursor-pointer appearance-none"
          >
            <option value="">Full Archive</option>
            <option value="shawl">Shawl</option>
            <option value="stole">Stole</option>
            <option value="pants">Pants</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchInput('');
              setCategory('');
            }}
            className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
          >
            <X size={18} />
          </Button>
        )}

        <Button
          onClick={onAddClick}
          className="bg-slate-900 hover:bg-black text-white rounded-2xl h-12 px-6 shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <PackagePlus size={18} className="text-indigo-400" />
          <span className="font-black text-[10px] uppercase tracking-[0.15em]">
            Add Product
          </span>
        </Button>
      </div>
    </div>
  );
}
