"use client";
import Link from "next/link";
import { Article } from "@/constant";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog`}
      className="group flex flex-col border border-white/10 bg-white/5 p-6 rounded-2xl hover:border-accent hover:bg-white/10 transition"
    >
      <p className="text-accent text-xs mb-2 font-bold uppercase tracking-wider">
        {article.category}
      </p>
      <h3 className="text-white font-bold text-lg group-hover:text-accent transition-colors">
        {article.title}
      </h3>
      <p className="text-gray-400 text-sm mt-2 flex-grow">{article.excerpt}</p>
      <div className="flex justify-between mt-6 text-xs text-gray-500 border-t border-white/5 pt-4">
        <span>{article.author}</span>
        <span>{article.readTime} read</span>
      </div>
    </Link>
  );
}
