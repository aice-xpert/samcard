"use client";

export default function BlogPostNewsletter() {
  return (
    <section className="py-16 bg-gradient-to-b from-black to-theme-devil-green/20 text-center px-6">
      <div className="max-w-xl mx-auto space-y-4">
        <h3 className="text-2xl font-bold text-white">Stay ahead of the curve</h3>
        <p className="text-gray-400">
          Weekly insights on AI, blockchain, quantum computing, and modern networking.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <input
            placeholder="Your email address"
            className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-accent outline-none text-sm w-64"
          />
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-theme-digital-green text-black font-semibold text-white hover:opacity-90 transition">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
