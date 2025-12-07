// src/features/products/components/ProductPage/Toast.jsx
import React from 'react';
import { Check } from 'lucide-react';

export default function Toast({ toast, copied }) {
  return (
    <>
      {toast && (
        <div className="fixed right-6 bottom-6 z-50">
          <div
            className="px-4 py-2 rounded-lg shadow-lg text-white"
            style={{ background: '#111' }}
          >
            {toast}
          </div>
        </div>
      )}

      {copied && (
        <div className="fixed right-6 bottom-6 z-50">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-white"
            style={{ background: '#0f5132' }}
          >
            <Check /> Link copied
          </div>
        </div>
      )}
    </>
  );
}
