export default function IntegrationSection() {
  return (
    <section className="py-20 bg-black text-center">
      <div className="max-w-4xl mx-auto px-6 border border-theme-devil-green rounded-3xl p-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          All Features Work Together Perfectly
        </h2>
        <p className="text-gray-400 mb-8">
          Our integrated platform ensures every feature works in harmony.
        </p>

        <div className="flex justify-center gap-4">
          <button className="px-8 py-4 bg-theme-devil-green text-white rounded-xl">
            Start Free Trial
          </button>
          <button className="px-8 py-4 border border-white/20 text-white rounded-xl">
            View Pricing
          </button>
        </div>
      </div>
    </section>
  );
}