"use client";
import Link from "next/link";
import { Article } from "@/constant";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col border border-border bg-muted p-6 rounded-2xl hover:border-accent hover:bg-muted/80 transition"
    >
      <p className="text-accent text-xs mb-2 font-bold uppercase tracking-wider">
        {article.category}
      </p>
      <h3 className="text-foreground font-bold text-lg group-hover:text-accent transition-colors">
        {article.title}
      </h3>
      <p className="text-muted-foreground text-sm mt-2 flex-grow">{article.excerpt}</p>
      <div className="flex justify-between mt-6 text-xs text-muted-foreground/60 border-t border-border pt-4">
        <span>{article.author}</span>
        <span>{article.readTime} read</span>
      </div>
    </Link>
  );
}