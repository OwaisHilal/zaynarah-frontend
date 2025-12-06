const GOLD = '#D4AF37';
const testimonials = [
  {
    name: 'Aisha K.',
    text: 'Absolutely love my shawl! The texture is divine.',
  },
  {
    name: 'Rohit S.',
    text: 'The craftsmanship is impeccable. Worth every rupee.',
  },
  {
    name: 'Meera P.',
    text: 'Elegant, warm, and beautifully made. Highly recommend!',
  },
];

function TestimonialCard({ name, text }) {
  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition">
      <p className="text-gray-800 mb-4">“{text}”</p>
      <p className="font-semibold" style={{ color: GOLD }}>
        {name}
      </p>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
        What Our Customers Say
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </div>
    </section>
  );
}
