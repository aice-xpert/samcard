"use client";

import Link from "next/link";
import type { Article } from "@/constant";

interface RelatedArticlesProps {
  category: string;
  articles: Article[];
}

export default function RelatedArticles({ category, articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-white/10 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-white mb-8">More in {category}</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/blog/${a.slug}`}
              className="group flex flex-col border border-white/10 bg-white/5 p-5 rounded-xl hover:border-accent hover:bg-white/10 transition"
            >
              <p className="text-accent text-xs mb-2 font-bold uppercase tracking-wider">
                {a.readTime} read
              </p>
              <h3 className="text-white font-semibold text-base group-hover:text-accent transition-colors leading-snug">
                {a.title}
              </h3>
              <p className="text-gray-500 text-sm mt-2 flex-grow line-clamp-2">{a.excerpt}</p>
              <p className="text-gray-600 text-xs mt-4">{a.author}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
