export default function StorySection() {
  return (
    <section
      className="relative py-28 bg-bg-secondary"
      aria-labelledby="story-heading"
    >
      <div className="max-w-7xl mx-auto px-6 grid gap-16 lg:grid-cols-2 items-center">
        {/* Left — Story */}
        <div className="space-y-8">
          <p className="text-xs uppercase tracking-widest text-text-secondary">
            Our Heritage
          </p>

          <h2
            id="story-heading"
            className="font-serif text-4xl md:text-5xl text-text-primary leading-tight"
          >
            Woven by Hand.
            <br />
            Guided by Tradition.
          </h2>

          <p className="text-lg text-text-secondary leading-relaxed max-w-xl">
            In the valleys of Kashmir, pashmina is not a product — it is a
            legacy. For generations, master artisans have spun, dyed, and
            handwoven each piece using techniques passed down through centuries.
          </p>

          <p className="text-lg text-text-secondary leading-relaxed max-w-xl">
            At Zaynarah, we work directly with these craftsmen to preserve their
            art, honor their skill, and bring authentic luxury to a modern
            wardrobe — without compromise.
          </p>

          <div className="pt-4">
            <span className="inline-block h-[1px] w-24 bg-[rgb(var(--brand-gold))]" />
          </div>
        </div>

        {/* Right — Visual / Quote */}
        <div className="relative">
          <div
            className="
              relative rounded-3xl bg-bg-primary p-10
              shadow-[0_25px_60px_rgba(0,0,0,0.12)]
            "
          >
            <blockquote className="space-y-6">
              <p className="font-serif text-2xl text-text-primary leading-relaxed">
                “Every Zaynarah piece carries the warmth of the hands that made
                it — and the soul of the land it comes from.”
              </p>

              <footer className="text-sm text-text-secondary">
                — Master Weaver, Kashmir
              </footer>
            </blockquote>
          </div>

          {/* Accent */}
          <div
            aria-hidden
            className="
              absolute -inset-6
              bg-[rgb(var(--brand-gold))]
              opacity-[0.03]
              blur-3xl
              -z-10
            "
          />
        </div>
      </div>
    </section>
  );
}
