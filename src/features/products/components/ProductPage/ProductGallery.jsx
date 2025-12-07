// src/features/products/components/ProductPage/ProductGallery.jsx
import React from 'react';

export default function ProductGallery({ product, mainImage, setMainImage }) {
  return (
    <div className="lg:col-span-6">
      <div
        className="rounded-3xl overflow-hidden border"
        style={{ borderColor: 'rgba(0,0,0,0.04)' }}
      >
        <img
          src={mainImage || '/HeroImg.jpg'}
          alt={product.title}
          className="w-full h-[520px] object-cover"
        />
      </div>

      {product.images?.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto py-1 no-scrollbar">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainImage(img)}
              className={`w-20 h-20 rounded-lg overflow-hidden border transition-transform focus:outline-none focus:ring-2 ${
                mainImage === img
                  ? 'scale-105 ring-2 ring-rose-200'
                  : 'hover:scale-105'
              }`}
              style={{ borderColor: 'rgba(0,0,0,0.06)' }}
              aria-label={`Show image ${i + 1}`}
            >
              <img
                src={img}
                alt={`thumb-${i}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
