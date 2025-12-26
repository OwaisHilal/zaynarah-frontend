// src/features/products/components/ProductPage/ProductDetails.jsx

import { ShieldCheck, Truck, RefreshCcw } from 'lucide-react';

export default function ProductDetails({ product }) {
  return (
    <section className="space-y-6">
      {/* Title */}
      <header>
        <h1 className="text-3xl md:text-4xl font-serif font-semibold leading-tight">
          {product.title}
        </h1>
      </header>

      {/* Price */}
      <div>
        <div className="text-2xl md:text-3xl font-semibold">
          ₹{product.price}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Inclusive of all taxes
        </p>
      </div>

      {/* Trust Stack */}
      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-3">
          <ShieldCheck size={18} className="mt-0.5 text-primary" />
          <span>
            <strong>Authentic Kashmiri Pashmina</strong> — sourced directly from
            certified artisans.
          </span>
        </li>

        <li className="flex items-start gap-3">
          <Truck size={18} className="mt-0.5 text-primary" />
          <span>
            <strong>Ships within 24–48 hours</strong> · Free delivery on orders
            over ₹1999.
          </span>
        </li>

        <li className="flex items-start gap-3">
          <RefreshCcw size={18} className="mt-0.5 text-primary" />
          <span>
            <strong>7-day easy returns</strong> — no questions asked.
          </span>
        </li>
      </ul>

      {/* Description */}
      <p className="text-sm leading-relaxed text-muted-foreground pt-2">
        {product.description}
      </p>

      {/* Divider */}
      <div className="h-px bg-border mt-4" />
    </section>
  );
}
