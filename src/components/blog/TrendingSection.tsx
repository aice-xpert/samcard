"use client";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { articles } from "@/constant";
import ArticleCard from "./ArticleCard";

export default function TrendingSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-16 bg-gradient-to-b from-black via-theme-devil-green/30 to-black"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-white text-3xl font-bold mb-10 flex items-center gap-2">
          <TrendingUp size={24} className="text-accent" /> Trending Articles
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.slice(1, 4).map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}