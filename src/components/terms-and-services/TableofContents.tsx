import { termsSections } from "@/constant";

export default function TableOfContents() {
  return (
    <div className="mt-10 p-8 bg-white/5 border border-white/10 rounded-xl">
      <h2 className="text-white text-2xl font-bold mb-6">Table of Contents</h2>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
        {termsSections.map((section) => (
          <a
            key={section.number}
            href={`#section-${section.number}`}
            className="flex items-center gap-3 text-gray-400 hover:text-theme-kelly-green transition-colors group"
          >
            <span className="text-theme-kelly-green font-semibold w-8">
              {section.number}.
            </span>

            <span className="group-hover:translate-x-1 transition-transform">
              {section.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}