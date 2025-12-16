const testimonials = [
  {
    name: 'Aisha Khan',
    location: 'Delhi',
    text: `The moment I wrapped the shawl around me, I could feel the difference.
    It’s not just warm — it feels alive. You can sense the craftsmanship in every thread.`,
  },
  {
    name: 'Rohit Sharma',
    location: 'Bengaluru',
    text: `I gifted a Zaynarah pashmina to my mother and she hasn’t stopped talking about it.
    The softness, the elegance — it truly feels special.`,
  },
  {
    name: 'Meera Patel',
    location: 'Mumbai',
    text: `I’ve owned luxury scarves before, but this feels different.
    There’s a quiet beauty to it — understated, refined, and deeply comforting.`,
  },
];

function TestimonialCard({ name, location, text }) {
  return (
    <article
      className="
        rounded-3xl
        bg-bg-secondary
        p-8
        shadow-[0_12px_30px_rgba(0,0,0,0.08)]
        transition
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]
      "
    >
      {/* Quote */}
      <p className="text-text-primary leading-relaxed text-lg">“{text}”</p>

      {/* Divider */}
      <div className="mt-6 h-px w-16 bg-[rgb(var(--brand-gold))]" />

      {/* Author */}
      <div className="mt-4">
        <p className="font-medium text-text-primary">{name}</p>
        <p className="text-sm text-text-secondary">{location}</p>
      </div>
    </article>
  );
}

export default function Testimonials() {
  return (
    <section
      className="py-28 bg-bg-primary"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <header className="mb-16 text-center">
          <p className="text-xs uppercase tracking-widest text-text-secondary">
            From Our Customers
          </p>

          <h2
            id="testimonials-heading"
            className="mt-3 font-serif text-4xl md:text-5xl text-text-primary"
          >
            Words That Mean Everything
          </h2>

          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Every piece we create carries a story — here’s what our customers
            feel when they wear Zaynarah.
          </p>
        </header>

        {/* Grid */}
        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
