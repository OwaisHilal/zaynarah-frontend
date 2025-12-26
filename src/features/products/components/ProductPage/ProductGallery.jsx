// src/features/products/components/ProductPage/ProductGallery.jsx

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductGallery({ product, mainImage, setMainImage }) {
  const images = product.images?.length ? product.images : ['/HeroImg.jpg'];

  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      {/* MAIN IMAGE */}
      <div className="space-y-4">
        <div
          className="relative rounded-3xl overflow-hidden border bg-card cursor-zoom-in"
          style={{ borderColor: 'rgba(0,0,0,0.06)' }}
          onClick={() => setFullscreen(true)}
        >
          <img
            src={mainImage || images[0]}
            alt={product.title}
            className="
              w-full h-[520px] object-cover
              transition-transform duration-500
              hover:scale-110
            "
          />

          {/* subtle overlay hint */}
          <span className="absolute bottom-4 right-4 text-xs bg-black/60 text-white px-3 py-1 rounded-full">
            Click to zoom
          </span>
        </div>

        {/* THUMBNAILS */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto py-1 no-scrollbar">
            {images.map((img, i) => {
              const active = img === mainImage;
              return (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={cn(
                    'relative w-20 h-20 rounded-xl overflow-hidden border transition',
                    active
                      ? 'ring-2 ring-primary'
                      : 'hover:ring-2 hover:ring-border'
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* FULLSCREEN VIEWER (MOBILE + DESKTOP) */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-6 right-6 text-white"
            aria-label="Close image viewer"
          >
            <X size={28} />
          </button>

          <img
            src={mainImage || images[0]}
            alt={product.title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </>
  );
}
