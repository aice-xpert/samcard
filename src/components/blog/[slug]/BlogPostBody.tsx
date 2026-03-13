"use client";

import { JSX } from "react";
import { motion } from "framer-motion";
import type { Article } from "@/constant";

interface BlogPostBodyProps {
  article: Article;
  content: string;
}

const renderInline = (text: string): string =>
  text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

function renderContent(raw: string): JSX.Element[] {
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
}

export default function BlogPostBody({ article, content }: BlogPostBodyProps) {
  return (
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
  );
}
