const mediaLogos = [
  {
    name: 'Vogue India',
    src: '/media/vogue.svg',
  },
  {
    name: 'Elle',
    src: '/media/elle.svg',
  },
  {
    name: 'Harper’s Bazaar',
    src: '/media/harpers.svg',
  },
  {
    name: 'GQ',
    src: '/media/gq.svg',
  },
];

function MediaLogo({ src, name }) {
  return (
    <img
      src={src}
      alt={name}
      title={name}
      loading="lazy"
      className="
        h-7
        object-contain
        opacity-60
        grayscale
        transition-all
        duration-300
        hover:opacity-90
        hover:grayscale-0
      "
    />
  );
}

export default function MediaShowcase() {
  return (
    <section
      className="
        py-24
        bg-bg-primary
      "
      aria-labelledby="media-heading"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <header className="mb-12">
          <p
            id="media-heading"
            className="
              text-xs
              uppercase
              tracking-[0.3em]
              text-text-secondary
            "
          >
            Recognised By
          </p>
        </header>

        {/* Logos */}
        <div
          className="
            flex flex-wrap
            items-center
            justify-center
            gap-x-16
            gap-y-12
          "
        >
          {mediaLogos.map((logo) => (
            <MediaLogo key={logo.name} {...logo} />
          ))}
        </div>

        {/* Soft fade-out */}
        <div className="mt-24 flex justify-center">
          <span
            className="
              h-px
              w-16
              bg-linear-to-r
              from-transparent
              via-[rgb(var(--brand-gold))]
              to-transparent
              opacity-40
            "
          />
        </div>
      </div>
    </section>
  );
}
