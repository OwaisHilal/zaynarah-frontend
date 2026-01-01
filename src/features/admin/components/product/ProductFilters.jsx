// src/features/admin/components/product/ProductFilters.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProductsStore } from '../../stores/productsStore';
import {
  Plus,
  Search,
  Filter,
  X,
  Grid3X3,
  ListFilter,
  PackagePlus,
  ArrowDownWideNarrow,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductFilters() {
  const { category, searchInput, setCategory, setSearchInput, clearSelection } =
    useProductsStore();

  const isFiltered = category !== '' || searchInput !== '';

  return (
    <div className="space-y-6">
      {' '}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {' '}
        <div>
          {' '}
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Catalog
          </h1>{' '}
          <p className="text-sm font-medium text-slate-500 mt-1">
            {' '}
            Maintain your product listings and inventory stock.{' '}
          </p>{' '}
        </div>
        <Button
          onClick={clearSelection}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 py-6 shadow-lg shadow-indigo-100 group transition-all active:scale-95"
        >
          <PackagePlus className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
          <span className="font-bold">Add New Product</span>
        </Button>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-2 rounded-[24px] border border-slate-200 shadow-sm ring-4 ring-slate-50/50">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by SKU, name or tags..."
            className="w-full h-12 border-none bg-transparent pl-11 pr-4 focus-visible:ring-0 text-sm font-medium placeholder:text-slate-400"
          />
        </div>

        <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

        <div className="flex items-center gap-2 w-full md:w-auto px-2">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 min-w-[160px]">
            <ListFilter size={14} className="text-slate-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none w-full cursor-pointer appearance-none"
            >
              <option value="">All Categories</option>
              <option value="shirts">Shirts</option>
              <option value="tshirts">T-Shirts</option>
              <option value="pants">Pants</option>
              <option value="accessories">Accessories</option>
            </select>
            <ArrowDownWideNarrow
              size={12}
              className="text-slate-400 pointer-events-none"
            />
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100"
            >
              <Grid3X3 size={18} />
            </Button>

            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchInput('');
                  setCategory('');
                }}
                className="h-10 px-3 rounded-xl text-xs font-black text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <X size={14} className="mr-1.5" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>
      {isFiltered && (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Active Filters:
          </span>
          {searchInput && (
            <div className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-indigo-100 flex items-center gap-2">
              Search: "{searchInput}"
              <X
                size={10}
                className="cursor-pointer"
                onClick={() => setSearchInput('')}
              />
            </div>
          )}
          {category && (
            <div className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-amber-100 flex items-center gap-2">
              Category: {category}
              <X
                size={10}
                className="cursor-pointer"
                onClick={() => setCategory('')}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
