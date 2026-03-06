"use client";
import { Mail, Tag } from "lucide-react";
import { tags } from "@/constant";

export default function Sidebar() {
  return (
    <div className="sticky top-24 space-y-6">
      {/* Email Subscription */}
      <div className="border border-accent/30 rounded-2xl p-6 bg-gradient-to-br from-accent/10 to-theme-digital-green/10">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Mail size={18} className="text-accent" />
          Stay Updated
        </h3>
        <p className="text-gray-400 text-sm mt-2">
          Weekly networking insights delivered to you.
        </p>
        <input
          placeholder="Email address"
          className="mt-4 w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white focus:border-accent outline-none"
        />
        <button className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-accent to-theme-digital-green text-black font-semibold hover:opacity-90 transition">
          Subscribe
        </button>
      </div>

      {/* Popular Tags */}
      <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Tag size={16} className="text-accent" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white/10 text-xs rounded-lg text-gray-300 border border-white/5 hover:border-accent/50 cursor-pointer transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}