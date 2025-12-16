import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-bg-primary">
      {/* Decorative gradient */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-transparent"
      />

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-14 px-6 py-28">
        {/* LEFT — Copy */}
        <div className="space-y-8">
          <header className="space-y-5">
            <h1 className="font-serif text-5xl md:text-6xl leading-tight text-text-primary">
              The Art of{' '}
              <span className="text-[rgb(var(--brand-gold))]">
                Timeless Elegance
              </span>
            </h1>

            <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
              Handcrafted Kashmiri pashmina shawls — woven by master artisans,
              designed for those who value heritage, warmth, and quiet luxury.
            </p>
          </header>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="
                inline-flex items-center gap-2
                rounded-full px-7 py-3
                font-medium
                bg-[rgb(var(--brand-gold))]
                text-[rgb(var(--brand-black))]
                hover:shadow-lg hover:scale-[1.02]
                transition
              "
            >
              Shop the Collection
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/the-craft"
              className="
                inline-flex items-center
                rounded-full px-7 py-3
                text-sm font-medium
                border border-border
                text-text-secondary
                hover:text-text-primary hover:border-text-primary
                transition
              "
            >
              Discover the Craft
            </Link>
          </div>

          {/* Trust strip */}
          <p className="text-sm text-text-secondary tracking-wide">
            ✦ Ethically sourced · Handwoven in Kashmir · Limited production
          </p>
        </div>

        {/* RIGHT — Image */}
        <div className="relative">
          <div
            className="
              relative rounded-3xl overflow-hidden
              shadow-[0_30px_80px_rgba(0,0,0,0.18)]
              transition-transform
              hover:scale-[1.015]
            "
          >
            <img
              src="/HeroImg.jpg"
              alt="Handcrafted Kashmiri Pashmina"
              className="w-full h-[420px] object-cover"
            />
          </div>

          {/* subtle overlay glow */}
          <div
            aria-hidden
            className="
              absolute -inset-6
              bg-[rgb(var(--brand-gold))]
              opacity-[0.04]
              blur-3xl
              -z-10
            "
          />
        </div>
      </div>
    </section>
  );
}
