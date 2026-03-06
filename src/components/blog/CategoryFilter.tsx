"use client";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <section className="z-50 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3 px-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
              selected === cat
                ? "bg-accent text-black"
                : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}