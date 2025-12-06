import { Link } from 'react-router-dom';
const GOLD = '#D4AF37';

const collections = [
  {
    title: 'Pashmina Shawls',
    img: 'https://images.unsplash.com/photo-1607735241669-c0c6e293e1f9',
  },
  {
    title: 'Winter Stoles',
    img: 'https://images.unsplash.com/photo-1585158536310-9e636cca06c3',
  },
  {
    title: 'Luxury Weave Collection',
    img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
  },
];

function CollectionCard({ title, img }) {
  return (
    <Link to="/shop" className="group">
      <div className="relative h-64 rounded-xl overflow-hidden shadow-lg transition-transform group-hover:scale-105 border-2 border-transparent group-hover:border-gradient-to-r group-hover:border-yellow-400">
        <img src={img} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <p className="text-white text-xl font-semibold">{title}</p>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedCollections() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
        Featured Collections
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {collections.map((col, idx) => (
          <CollectionCard key={idx} {...col} />
        ))}
      </div>
    </section>
  );
}
