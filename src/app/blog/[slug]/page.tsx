"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { articles } from "@/constant";

import BlogPostHero from "@/components/blog/[slug]/BlogPostHero";
import BlogPostBody from "@/components/blog/[slug]/BlogPostBody";
import RelatedArticles from "@/components/blog/[slug]/RelatedArticles";
import BlogPostNewsletter from "@/components/blog/[slug]/BlogPostNewsletter";

// Import all article content
import { content as content1, timeline as timeline1 } from "@/article_data/how-to-keep-up-in-the-ai-age";
import { content as content2, timeline as timeline2 } from "@/article_data/quantum-computing-transforming-technology";
import { content as content3, timeline as timeline3 } from "@/article_data/avoid-these-7-blockchain-startup-mistakes";
import { content as content4, timeline as timeline4 } from "@/article_data/will-ai-really-replace-human-workers";
import { content as content5, timeline as timeline5 } from "@/article_data/10-ways-ai-will-reshape-jobs";
import { content as content6, timeline as timeline6 } from "@/article_data/how-agentic-ai-transforms-dev-workflow";
import { content as content7, timeline as timeline7 } from "@/article_data/how-to-build-profitable-apps-with-generative-ai";
import { content as content8, timeline as timeline8 } from "@/article_data/launch-profitable-blockchain-product-90-days";
import { content as content9, timeline as timeline9 } from "@/article_data/why-blockchain-products-fail";
import { content as content10, timeline as timeline10 } from "@/article_data/secure-your-transactions-with-blockchain";
import { content as content11, timeline as timeline11 } from "@/article_data/can-quantum-computers-break-sha-256";
import { content as content12, timeline as timeline12 } from "@/article_data/accelerate-growth-with-quantum-computing";
import { content as content13, timeline as timeline13 } from "@/article_data/quantum-computing-roadmap-for-ceos";
import { content as content14, timeline as timeline14 } from "@/article_data/10-networking-mistakes-professionals-make";
import { content as content15, timeline as timeline15 } from "@/article_data/networking-hacks-for-busy-executives";
import { content as content16, timeline as timeline16 } from "@/article_data/design-digital-business-cards-for-networking";
import { content as content17, timeline as timeline17 } from "@/article_data/networking-101-leverage-nfc-technology";

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

const articleTimelineMap: Record<string, string[]> = {
  "how-to-keep-up-in-the-ai-age": timeline1,
  "quantum-computing-transforming-technology": timeline2,
  "avoid-these-7-blockchain-startup-mistakes": timeline3,
  "will-ai-really-replace-human-workers": timeline4,
  "10-ways-ai-will-reshape-jobs": timeline5,
  "how-agentic-ai-transforms-dev-workflow": timeline6,
  "how-to-build-profitable-apps-with-generative-ai": timeline7,
  "launch-profitable-blockchain-product-90-days": timeline8,
  "why-blockchain-products-fail": timeline9,
  "secure-your-transactions-with-blockchain": timeline10,
  "can-quantum-computers-break-sha-256": timeline11,
  "accelerate-growth-with-quantum-computing": timeline12,
  "quantum-computing-roadmap-for-ceos": timeline13,
  "10-networking-mistakes-professionals-make": timeline14,
  "networking-hacks-for-busy-executives": timeline15,
  "design-digital-business-cards-for-networking": timeline16,
  "networking-101-leverage-nfc-technology": timeline17,
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  const article = articles.find((a) => a.slug === slug);

  if (!article) notFound();

  const content = articleContentMap[article.slug] ?? article.excerpt;
  const timeline = articleTimelineMap[article.slug] ?? [];
  const related = articles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  return (
    <>
      <BlogPostHero article={article} />
      <div className="bg-black">
        <BlogPostBody article={article} content={content} timeline={timeline} />
        <RelatedArticles category={article.category} articles={related} />
        <BlogPostNewsletter />
      </div>
    </>
  );
}