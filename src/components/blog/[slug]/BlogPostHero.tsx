"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import type { Article } from "@/constant";
import { useTheme } from "@/contexts/ThemeContext";
import BlogKeywords from "./BlogKeywords";

interface BlogPostHeroProps {
  article: Article;
}

export default function BlogPostHero({ article }: BlogPostHeroProps) {
  const { isDark } = useTheme();

  const imageSrc = `/blog/${article.slug}.jpg`; 

  return (
    <section className={`pt-32 pb-8 overflow-hidden ${
      isDark
        ? "bg-gradient-to-b from-theme-devil-green via-black to-black"
        : "bg-gradient-to-b from-theme-devil-green via-background to-background"
    }`}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition text-sm mb-10"
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

          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
            {article.title}
          </h1>

          <BlogKeywords points={article.keywords} />

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground border-t border-border pt-6">
            <span className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-theme-digital-green flex items-center justify-center text-black text-xs font-bold flex-shrink-0">
                {article.author.charAt(0)}
              </div>
              <span className="text-muted-foreground">{article.author}</span>
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
        <div className={`w-full rounded-2xl overflow-hidden relative ${
          isDark
            ? "bg-gradient-to-br from-accent/20 via-theme-digital-green/10 to-black border border-white/10"
            : "bg-gradient-to-br from-accent/20 via-theme-digital-green/10 to-background border border-border"
        }`}>
          <Image
            src={imageSrc}
            alt={article.title}
            width={1200}
            height={800}
            sizes="(max-width: 1024px) 100vw, 896px"
            className="w-full h-auto rounded-2xl"
          />
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
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
