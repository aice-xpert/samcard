"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/constant";
import { Calendar, User, TrendingUp, BookOpen, ArrowRight } from "lucide-react";

interface FeaturedArticleProps {
  article: Article;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid md:grid-cols-3 gap-10 border border-accent/40 rounded-3xl p-10 bg-white/5"
    >
      <div className="md:col-span-2 space-y-5">
        <div className="inline-flex items-center gap-2 text-accent">
          <TrendingUp size={16} />
          Featured Article
        </div>
        <h2 className="text-4xl font-bold text-white">{article.title}</h2>
        <p className="text-gray-400 text-lg">{article.excerpt}</p>
        <div className="flex gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {article.date}
          </span>
          <span className="flex items-center gap-1">
            <User size={14} />
            {article.author}
          </span>
        </div>
        <Link
          href={`/blog/${article.slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-theme-digital-green text-black rounded-xl font-semibold hover:scale-105 transition-transform"
        >
          Read Article
          <ArrowRight size={18} />
        </Link>
      </div>
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-accent/20 to-theme-digital-green/20 rounded-2xl">
        <BookOpen size={60} className="text-white/40" />
      </div>
    </motion.div>
  );
}