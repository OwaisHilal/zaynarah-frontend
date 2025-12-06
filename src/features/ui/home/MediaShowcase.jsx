const mediaLogos = [
  'https://via.placeholder.com/120x40?text=Vogue',
  'https://via.placeholder.com/120x40?text=Elle',
  "https://via.placeholder.com/120x40?text=Harper's",
];

function MediaLogo({ src }) {
  return (
    <img
      src={src}
      alt="Media Logo"
      className="h-10 object-contain grayscale hover:grayscale-0 transition-transform hover:scale-110"
    />
  );
}

export default function MediaShowcase() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 text-center">
      <h4 className="text-xl font-semibold text-gray-800 mb-6">Featured In</h4>
      <div className="flex flex-wrap justify-center items-center gap-12">
        {mediaLogos.map((logo, i) => (
          <MediaLogo key={i} src={logo} />
        ))}
      </div>
    </section>
  );
}
