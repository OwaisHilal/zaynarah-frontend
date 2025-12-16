import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');

      // 🔒 Placeholder for backend integration
      await new Promise((res) => setTimeout(res, 900));

      setStatus('success');
      setMessage('You’re in. Welcome to the Zaynarah circle.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section
      className="py-28 bg-bg-secondary"
      aria-labelledby="newsletter-heading"
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Heading */}
        <header className="space-y-4 mb-10">
          <p className="text-xs uppercase tracking-widest text-text-secondary">
            Private Access
          </p>

          <h2
            id="newsletter-heading"
            className="font-serif text-4xl md:text-5xl text-text-primary"
          >
            Join Our Inner Circle
          </h2>

          <p className="text-lg text-text-secondary">
            Early access to new collections, artisan stories, and limited
            releases — shared quietly with our subscribers.
          </p>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus('idle');
              setMessage('');
            }}
            placeholder="Enter your email address"
            className={cn(
              `
              w-full sm:flex-1
              rounded-full px-6 py-3
              bg-bg-primary
              border
              text-text-primary
              placeholder:text-text-secondary
              focus:outline-none focus:ring-2
              transition
            `,
              status === 'error'
                ? 'border-red-500 focus:ring-red-200'
                : 'border-border focus:ring-[rgb(var(--brand-gold))/30]'
            )}
            disabled={status === 'loading' || status === 'success'}
          />

          <Button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="
              rounded-full px-8 py-3
              font-medium
              bg-[rgb(var(--brand-gold))]
              text-[rgb(var(--brand-black))]
              hover:shadow-lg
              transition
            "
          >
            {status === 'loading'
              ? 'Joining…'
              : status === 'success'
              ? 'Subscribed'
              : 'Join'}
          </Button>
        </form>

        {/* Feedback */}
        {message && (
          <p
            className={cn(
              'mt-4 text-sm',
              status === 'error' ? 'text-red-600' : 'text-text-secondary'
            )}
          >
            {message}
          </p>
        )}

        {/* Footer note */}
        <p className="mt-6 text-xs text-text-secondary">
          We respect your privacy. No spam — only thoughtful updates.
        </p>
      </div>
    </section>
  );
}
