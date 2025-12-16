import { Truck, ShieldCheck, CreditCard, Star } from 'lucide-react';

const items = [
  {
    icon: Truck,
    label: 'Free Shipping',
    sub: 'On orders over ₹1999',
  },
  {
    icon: ShieldCheck,
    label: 'Authentic Pashmina',
    sub: 'Certified Kashmiri craft',
  },
  {
    icon: CreditCard,
    label: 'Secure Payments',
    sub: 'Encrypted checkout',
  },
  {
    icon: Star,
    label: 'Premium Quality',
    sub: 'Luxury-grade materials',
  },
];

function InfoItem({ icon: Icon, label, sub }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="
          flex h-10 w-10 items-center justify-center
          rounded-full
          bg-bg-secondary
          text-[rgb(var(--brand-gold))]
        "
      >
        <Icon size={18} />
      </div>

      <div className="leading-tight">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-secondary">{sub}</p>
      </div>
    </div>
  );
}

export default function InfoStrip() {
  return (
    <section
      role="region"
      aria-label="Store highlights"
      className="
        border-y border-border
        bg-bg-primary/80
        backdrop-blur
      "
    >
      <div
        className="
          max-w-7xl mx-auto
          px-6 py-6
          grid gap-6
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {items.map((item) => (
          <InfoItem key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}
