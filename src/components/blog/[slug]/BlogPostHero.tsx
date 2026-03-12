"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import type { Article } from "@/constant";

interface BlogPostHeroProps {
  article: Article;
}

export default function BlogPostHero({ article }: BlogPostHeroProps) {

  const imageSrc = `/blog/${article.slug}.jpg`; 

  return (
    <section className="pt-32 pb-8 bg-gradient-to-b from-theme-devil-green via-black to-black overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition text-sm mb-10"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent">
            <Tag size={12} />
            {article.category}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            {article.title}
          </h1>

          <p className="text-xl text-gray-400 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 border-t border-white/10 pt-6">
            <span className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-theme-digital-green flex items-center justify-center text-black text-xs font-bold flex-shrink-0">
                {article.author.charAt(0)}
              </div>
              <span className="text-gray-300">{article.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {article.readTime} read
            </span>
          </div>
        </motion.div>
      </div>

      {/* Hero visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto px-6 mt-12"
      >
        <div className="w-full aspect-[16/7] rounded-2xl bg-gradient-to-br from-accent/20 via-theme-digital-green/10 to-black border border-white/10 flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
          <img
            src={imageSrc}
            alt={article.title}
            className="w-full h-full object-cover rounded-2xl"
          />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
