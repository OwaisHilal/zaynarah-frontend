// src/features/admin/components/Pagination.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Simple logic to show a few page numbers
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onPageChange(i)}
          className={cn(
            'h-9 w-9 rounded-xl font-bold text-xs transition-all',
            currentPage === i
              ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          )}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 w-full">
      {' '}
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest order-2 sm:order-1">
        {' '}
        Page <span className="text-slate-900">{currentPage}</span> of{' '}
        <span className="text-slate-900">{totalPages}</span>{' '}
      </p>
      <div className="flex items-center gap-1 order-1 sm:order-2 bg-white p-1 rounded-[14px] border border-slate-200 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </Button>

        <div className="flex items-center gap-1 px-1">
          {renderPageNumbers()}
        </div>

        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
