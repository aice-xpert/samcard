"use client";
import { useState, useMemo } from "react";
import BlogHero from "@/components/blog/BlogHero";
import FeaturedArticle from "@/components/blog/FeaturedArticle";
import CategoryFilter from "@/components/blog/CategoryFilter";
import ArticleGrid from "@/components/blog/ArticleGrid";
import Sidebar from "@/components/blog/SideBar";
import TrendingSection from "@/components/blog/TrendingSection";
import ProTipsAndCommunity from "@/components/blog/ProTipsAndCommunity";

import { articles, featuredArticle, categories } from "@/constant";

export default function BlogPage() {
  const [category, setCategory] = useState("All");

  const filteredArticles = useMemo(() => {
    let list = articles.filter((a) => a.id !== featuredArticle.id);
    if (category !== "All") {
      list = list.filter((a) => a.category === category);
    }
    return list;
  }, [category]);

  return (
    <div className="bg-black min-h-screen">
      <BlogHero />
      <section className="pb-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <FeaturedArticle article={featuredArticle} />
        </div>
      </section>
      <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <ArticleGrid articles={filteredArticles} />
          </div>
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </section>
      <TrendingSection />
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <ProTipsAndCommunity />
        </div>
      </section>
    </div>
  );
}