import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    title: 'Pashmina Shawls',
    subtitle: 'Heritage weaves for timeless warmth',
    image: 'https://images.unsplash.com/photo-1607735241669-c0c6e293e1f9',
  },
  {
    title: 'Winter Stoles',
    subtitle: 'Light layers, elevated comfort',
    image: 'https://images.unsplash.com/photo-1585158536310-9e636cca06c3',
  },
  {
    title: 'Luxury Weaves',
    subtitle: 'Statement pieces in rare patterns',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
  },
];

function CollectionCard({ title, subtitle, image }) {
  return (
    <Link
      to="/shop"
      className="
        group relative overflow-hidden rounded-3xl
        border border-border
        bg-bg-primary
        transition
        hover:shadow-[0_25px_60px_rgba(0,0,0,0.18)]
      "
    >
      {/* Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="
            h-full w-full object-cover
            transition-transform duration-700
            group-hover:scale-[1.06]
          "
        />

        {/* Soft overlay */}
        <div
          aria-hidden
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/45 via-black/10 to-transparent
          "
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <p className="text-xs uppercase tracking-widest text-white/70">
          Collection
        </p>

        <h3 className="mt-1 font-serif text-2xl text-white">{title}</h3>

        <p className="mt-1 text-sm text-white/80 max-w-xs">{subtitle}</p>

        <span
          className="
            mt-4 inline-flex items-center gap-2
            text-sm font-medium
            text-white
            opacity-0
            translate-y-2
            transition-all
            group-hover:opacity-100
            group-hover:translate-y-0
          "
        >
          Explore Collection
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

export default function FeaturedCollections() {
  return (
    <section className="py-24" aria-labelledby="featured-collections-heading">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <header className="mb-14 text-center">
          <h2
            id="featured-collections-heading"
            className="font-serif text-4xl md:text-5xl text-text-primary"
          >
            Curated Collections
          </h2>

          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Thoughtfully designed pieces that reflect heritage, craftsmanship,
            and modern elegance.
          </p>
        </header>

        {/* Grid */}
        <div className="grid gap-10 md:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.title} {...collection} />
          ))}
        </div>
      </div>
    </section>
  );
}
