"use client";

import React, { JSX, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { articles } from "@/constant";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";

// Import all article content
import { content as content1 } from "@/article_data/how-to-keep-up-in-the-ai-age";
import { content as content2 } from "@/article_data/quantum-computing-transforming-technology";
import { content as content3 } from "@/article_data/avoid-these-7-blockchain-startup-mistakes";
import { content as content4 } from "@/article_data/will-ai-really-replace-human-workers";
import { content as content5 } from "@/article_data/10-ways-ai-will-reshape-jobs";
import { content as content6 } from "@/article_data/how-agentic-ai-transforms-dev-workflow";
import { content as content7 } from "@/article_data/how-to-build-profitable-apps-with-generative-ai";
import { content as content8 } from "@/article_data/launch-profitable-blockchain-product-90-days";
import { content as content9 } from "@/article_data/why-blockchain-products-fail";
import { content as content10 } from "@/article_data/secure-your-transactions-with-blockchain";
import { content as content11 } from "@/article_data/can-quantum-computers-break-sha-256";
import { content as content12 } from "@/article_data/accelerate-growth-with-quantum-computing";
import { content as content13 } from "@/article_data/quantum-computing-roadmap-for-ceos";
import { content as content14 } from "@/article_data/10-networking-mistakes-professionals-make";
import { content as content15 } from "@/article_data/networking-hacks-for-busy-executives";
import { content as content16 } from "@/article_data/design-digital-business-cards-for-networking";
import { content as content17 } from "@/article_data/networking-101-leverage-nfc-technology";

const articleContentMap: Record<string, string> = {
  "how-to-keep-up-in-the-ai-age": content1,
  "quantum-computing-transforming-technology": content2,
  "avoid-these-7-blockchain-startup-mistakes": content3,
  "will-ai-really-replace-human-workers": content4,
  "10-ways-ai-will-reshape-jobs": content5,
  "how-agentic-ai-transforms-dev-workflow": content6,
  "how-to-build-profitable-apps-with-generative-ai": content7,
  "launch-profitable-blockchain-product-90-days": content8,
  "why-blockchain-products-fail": content9,
  "secure-your-transactions-with-blockchain": content10,
  "can-quantum-computers-break-sha-256": content11,
  "accelerate-growth-with-quantum-computing": content12,
  "quantum-computing-roadmap-for-ceos": content13,
  "10-networking-mistakes-professionals-make": content14,
  "networking-hacks-for-busy-executives": content15,
  "design-digital-business-cards-for-networking": content16,
  "networking-101-leverage-nfc-technology": content17,
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const content = articleContentMap[article.slug] ?? article.excerpt;

  const renderInline = (text: string): string =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

  const renderContent = (raw: string) => {
    const lines = raw.trim().split("\n");
    const elements: JSX.Element[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold text-white mt-12 mb-4 leading-tight">
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-xl font-semibold text-white mt-8 mb-3">
            {line.replace("### ", "")}
          </h3>
        );
      } else if (line.trim() === "") {
        // skip blank lines
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        const items: string[] = [];
        while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
          items.push(lines[i].replace(/^[-*] /, ""));
          i++;
        }
        elements.push(
          <ul key={`list-${i}`} className="my-4 space-y-2 pl-0">
            {items.map((item, idx) => (
              <li key={idx} className="flex gap-3 text-gray-300 leading-relaxed">
                <span className="text-accent mt-1 flex-shrink-0">•</span>
                <span dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
              </li>
            ))}
          </ul>
        );
        continue;
      } else {
        elements.push(
          <p
            key={i}
            className="text-gray-300 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: renderInline(line) }}
          />
        );
      }
      i++;
    }

    return elements;
  };

  const related = articles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  return (
    <>
      {/* ── Hero band — matches the site-wide gradient from navbar into page ── */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-theme-devil-green via-black to-black overflow-hidden">
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

          {/* Category + Title + Excerpt */}
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

            <p className="text-xl text-gray-400 leading-relaxed">{article.excerpt}</p>

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

        {/* Hero visual — bleeds to the bottom of the gradient band */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto px-6 mt-12"
        >
          <div className="w-full aspect-[16/7] rounded-2xl bg-gradient-to-br from-accent/20 via-theme-digital-green/10 to-black border border-white/10 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
            <p className="relative z-10 text-6xl font-black text-white/5 select-none leading-none tracking-tighter uppercase text-center px-8">
              {article.category}
            </p>
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

      {/* ── Article body — pure black background ── */}
      <div className="bg-black">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-4xl mx-auto px-6 pt-16 pb-24"
        >
          <div className="space-y-5">{renderContent(content)}</div>

          {/* Author card */}
          <div className="mt-16 border border-white/10 rounded-2xl p-6 bg-white/5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-theme-digital-green flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
              {article.author.charAt(0)}
            </div>
            <div>
              <p className="text-white font-semibold">{article.author}</p>
              <p className="text-gray-400 text-sm mt-1">
                Contributing writer at the Digital Networking Insights blog. Writing about{" "}
                {article.category} and the intersection of technology and professional growth.
              </p>
            </div>
          </div>
        </motion.article>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="border-t border-white/10 bg-white/[0.02]">
            <div className="max-w-4xl mx-auto px-6 py-16">
              <h2 className="text-xl font-bold text-white mb-8">More in {article.category}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                {related.map((a) => (
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
        )}

        {/* Footer CTA */}
        <section className="py-16 bg-gradient-to-b from-black to-theme-devil-green/20 text-center px-6">
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold text-white">Stay ahead of the curve</h3>
            <p className="text-gray-400">
              Weekly insights on AI, blockchain, quantum computing, and modern networking.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <input
                placeholder="Your email address"
                className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-accent outline-none text-sm w-64"
              />
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-theme-digital-green text-black font-semibold text-sm hover:opacity-90 transition">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}