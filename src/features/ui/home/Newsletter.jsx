// src/features/ui/home/Newsletter.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const ROSE_GOLD = '#F5C7C7';
const GOLD = '#D4AF37';
const BG_COLOR = '#FFF8F5'; // soft off-white

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return alert('Please enter your email!');
    alert(`Subscribed with ${email}`);
    setEmail('');
  };

  return (
    <section className="py-20" style={{ background: BG_COLOR }}>
      <div className="max-w-3xl mx-auto text-center px-6">
        <h3
          className="text-3xl md:text-4xl font-serif font-bold mb-4"
          style={{ color: GOLD }}
        >
          Stay in the Loop
        </h3>
        <p className="text-gray-700 mb-8 text-lg">
          Subscribe to our newsletter for exclusive offers, stories from
          Kashmir, and sneak peeks of our new collections.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-5 py-3 rounded-full w-full sm:w-auto flex-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-200 transition"
          />
          <Button
            type="submit"
            className="rounded-full px-8 py-3 font-semibold transition-all hover:shadow-lg"
            style={{
              background: `linear-gradient(90deg, ${ROSE_GOLD}, ${GOLD})`,
              color: '#fff',
            }}
          >
            Subscribe
          </Button>
        </form>

        <p className="text-gray-500 text-sm mt-4">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
