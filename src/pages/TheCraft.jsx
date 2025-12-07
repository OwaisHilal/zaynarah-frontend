// src/pages/TheCraftPage.jsx
import React from 'react';

export default function TheCraftPage() {
  // Define colors inside the file
  const GOLD = '#D4AF37';
  const DEEP_BLACK = '#0A0A0A';
  const ROSE = '#B76E79';

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      {/* Content Section 1: The Art of Weaving */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <img
          src="/assets/logo.png"
          alt="Weaving Process"
          className="w-full md:w-1/2 rounded-xl shadow-lg"
        />
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl font-serif font-bold" style={{ color: ROSE }}>
            Hand-Woven to Perfection
          </h2>
          <p className="text-gray-700 text-lg">
            Each Pashmina shawl is handwoven by skilled artisans using age-old
            techniques passed down through generations. The delicate weave
            ensures a soft, luxurious drape that is both lightweight and warm.
          </p>
        </div>
      </section>

      {/* Content Section 2: The Materials */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row-reverse items-center gap-12 bg-gray-50">
        <img
          src="/HeroImg.jpg"
          alt="Raw Pashmina Wool"
          className="w-full md:w-1/2 rounded-xl shadow-lg"
        />
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl font-serif font-bold" style={{ color: GOLD }}>
            Exquisite Materials
          </h2>
          <p className="text-gray-700 text-lg">
            Sourced from the valleys of Kashmir, only the finest undercoat
            fibers of the Himalayan goats are selected. Each strand is
            meticulously spun to preserve the softness and integrity of the
            material.
          </p>
        </div>
      </section>

      {/* Content Section 3: The Finishing Touch */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center gap-6">
        <h2
          className="text-3xl md:text-4xl font-serif font-bold"
          style={{ color: DEEP_BLACK }}
        >
          Timeless Finishing
        </h2>
        <p className="text-gray-700 text-lg max-w-3xl">
          Hand-finished fringes, subtle patterns, and impeccable attention to
          detail ensure that each shawl is a piece of art. Our commitment to
          quality guarantees that these treasures can be passed down as
          heirlooms.
        </p>
        <img
          src="/assets/logo.png"
          alt="Finished Pashmina Shawl"
          className="w-full md:w-1/2 rounded-xl shadow-lg mt-6"
        />
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <a
          href="/shop"
          className="inline-block px-8 py-3 rounded-full font-medium text-lg transition-transform transform hover:scale-105"
          style={{
            background: GOLD,
            color: DEEP_BLACK,
            boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          }}
        >
          Explore The Collection
        </a>
      </section>
    </main>
  );
}
