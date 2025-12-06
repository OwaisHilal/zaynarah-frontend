import { Link } from 'react-router-dom';
const GOLD = '#D4AF37';
const ROSE_GOLD = '#B76E79';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-black/5 to-transparent">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10 px-6 py-24">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif leading-tight text-gray-900">
            The Art of&nbsp;
            <span style={{ color: GOLD }}>Elegance</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-lg">
            Discover timeless shawls and scarves crafted with centuries-old
            techniques — where heritage meets refined modernity.
          </p>
          <div className="flex gap-4 mt-6">
            <Link
              to="/shop"
              className="px-6 py-3 rounded-full text-sm font-medium transition"
              style={{ background: GOLD, color: '#0A0A0A' }}
            >
              Shop Now
            </Link>
            <Link
              to="/the-craft"
              className="px-6 py-3 rounded-full text-sm font-medium border border-gray-300 hover:border-rose-600 hover:text-rose-600 transition"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-transform hover:scale-105">
          <img
            src="/HeroImg.jpg"
            alt="Hero"
            className="w-full h-96 object-cover"
          />
        </div>
      </div>
    </section>
  );
}
