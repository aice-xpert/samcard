"use client";
import { Mail, Tag } from "lucide-react";
import { tags } from "@/constant";

export default function Sidebar() {
  return (
    <div className="sticky top-24 space-y-6">
      <div className="border border-accent/30 rounded-2xl p-6 bg-gradient-to-br from-accent/10 to-theme-digital-green/10">
        <h3 className="text-foreground font-bold text-lg flex items-center gap-2">
          <Mail size={18} className="text-accent" />
          Stay Updated
        </h3>
        <p className="text-muted-foreground text-sm mt-2">
          Weekly networking insights delivered to you.
        </p>
        <input
          placeholder="Email address"
          className="mt-4 w-full px-4 py-2 rounded-lg bg-background/40 border border-border text-foreground focus:border-accent outline-none"
        />
        <button className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-accent to-theme-digital-green text-black font-semibold hover:opacity-90 transition">
          Subscribe
        </button>
      </div>

      <div className="border border-border rounded-2xl p-6 bg-muted">
        <h3 className="text-foreground font-bold flex items-center gap-2">
          <Tag size={16} className="text-accent" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-muted text-xs rounded-lg text-muted-foreground border border-border hover:border-accent/50 cursor-pointer transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}