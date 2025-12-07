// src/features/products/components/ProductPage/SizeGuideModal.jsx
import React from 'react';

export default function SizeGuideModal({ setShowSizeGuide }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setShowSizeGuide(false)}
      />
      <div className="relative bg-white rounded-2xl p-6 max-w-lg w-full z-10 shadow-xl">
        <h3 className="text-xl font-semibold mb-3">Size Guide</h3>
        <p className="text-sm text-gray-700 mb-4">
          Approximate dimensions — measure your preferred wrap style.
        </p>
        <table className="w-full text-sm mb-4">
          <thead>
            <tr>
              <th className="text-left pb-2">Size</th>
              <th className="text-left pb-2">Length</th>
              <th className="text-left pb-2">Width</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">Small</td>
              <td className="py-2">200 cm</td>
              <td className="py-2">70 cm</td>
            </tr>
            <tr>
              <td className="py-2">Medium</td>
              <td className="py-2">220 cm</td>
              <td className="py-2">80 cm</td>
            </tr>
            <tr>
              <td className="py-2">Large</td>
              <td className="py-2">240 cm</td>
              <td className="py-2">90 cm</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowSizeGuide(false)}
            className="px-4 py-2 rounded-lg border"
            style={{ borderColor: 'rgba(0,0,0,0.06)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
