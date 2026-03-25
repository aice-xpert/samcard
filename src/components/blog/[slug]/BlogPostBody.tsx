"use client";

import { useMemo } from "react";
import { JSX } from "react";
import { motion } from "framer-motion";
import type { Article } from "@/constant";
import ProcessTimeline from "./ProcessTimeline";

interface BlogPostBodyProps {
  article: Article;
  content: string;
  timeline: string[];
}

const renderInline = (text: string): string =>
  text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

interface Section {
  title: string;
  content: string[];
}

function parseSections(raw: string): { intro: string[]; sections: Section[]; conclusion: string[] } {
  const lines = raw.trim().split("\n");
  const intro: string[] = [];
  const sections: Section[] = [];
  const conclusion: string[] = [];
  
  let currentSection: Section | null = null;
  let inConclusion = false;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace("## ", ""),
        content: [],
      };
      inConclusion = false;
    } else if (line.startsWith("### ") || line.trim() === "") {
      // Skip ### headings and blank lines
    } else if (line.toLowerCase().includes("what i'd tell myself") || 
               line.toLowerCase().includes("final thoughts") ||
               line.toLowerCase().includes("conclusion")) {
      inConclusion = true;
      if (currentSection) {
        sections.push(currentSection);
        currentSection = null;
      }
      conclusion.push(line);
    } else if (currentSection) {
      currentSection.content.push(line);
    } else if (inConclusion) {
      conclusion.push(line);
    } else {
      intro.push(line);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return { intro, sections, conclusion };
}

function renderParagraph(text: string): JSX.Element {
  return (
    <p
      key={text.slice(0, 20)}
      className="text-gray-300 leading-relaxed text-lg"
      dangerouslySetInnerHTML={{ __html: renderInline(text) }}
    />
  );
}

export default function BlogPostBody({ article, content, timeline }: BlogPostBodyProps) {
  const { intro, sections, conclusion } = useMemo(() => parseSections(content), [content]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="max-w-4xl mx-auto px-6 pt-16 pb-24"
    >
      <div className="space-y-5">
        {intro.map((line) => line.trim() && renderParagraph(line))}
      </div>

      {sections.map((section, idx) => (
        <div key={idx}>
          <h2 className="text-2xl font-bold text-white mt-12 mb-4 leading-tight">
            {section.title}
          </h2>
          
          <div className="space-y-5">
            {section.content.map((line) => 
              line.trim() && renderParagraph(line)
            )}
          </div>
        </div>
      ))}

      {conclusion.map((line) => 
        line.trim() && !line.startsWith("##") && renderParagraph(line)
      )}

      <ProcessTimeline points={timeline} />

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
