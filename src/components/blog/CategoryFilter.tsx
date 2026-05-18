"use client";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <section className="z-50 py-6 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3 px-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
              selected === cat
                ? "bg-accent text-black"
                : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}