import type { Metadata } from "next";
import PublicCardClient from "./page";

interface PublicCard {
  id: string;
  name: string;
  slug: string;
  status: string;
  content: {
    formData: {
      name: string;
      title: string;
      company: string;
    };
  };
  businessProfile?: Record<string, unknown>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "";
  const PUBLIC_BASE = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://samcard.vercel.app";
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/public/cards/${slug}`);
    if (!response.ok) {
      return { 
        title: "SamCard",
        alternates: { canonical: `${PUBLIC_BASE}/${slug}` }
      };
    }
    const card = await response.json() as PublicCard;
    const name = card.content?.formData?.name || (card.businessProfile as Record<string, unknown>)?.name?.toString() || "";
    const title = card.content?.formData?.title || (card.businessProfile as Record<string, unknown>)?.title?.toString() || "";
    
    if (name && title) {
      return { 
        title: `${name} - ${title}`,
        alternates: { canonical: `${PUBLIC_BASE}/${slug}` }
      };
    } else if (name) {
      return { 
        title: name,
        alternates: { canonical: `${PUBLIC_BASE}/${slug}` }
      };
    }
    return { 
      title: "SamCard",
      alternates: { canonical: `${PUBLIC_BASE}/${slug}` }
    };
  } catch {
    return { 
      title: "SamCard",
      alternates: { canonical: `${PUBLIC_BASE}/${slug}` }
    };
  }
}

export default function PublicCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}