const GOLD = '#D4AF37';
export default function StorySection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h3 className="text-3xl font-bold mb-6" style={{ color: GOLD }}>
          The Zaynarah Story
        </h3>
        <p className="text-gray-800 text-lg leading-relaxed max-w-3xl mx-auto">
          For generations, skilled Kashmiri artisans have handcrafted exquisite
          Pashmina pieces — each thread woven with precision, love, and
          centuries of tradition. At Zaynarah, we honor this heritage by
          bringing authentic luxury to the modern world.
        </p>
      </div>
    </section>
  );
}
