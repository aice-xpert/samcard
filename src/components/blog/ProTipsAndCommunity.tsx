"use client";

import { Star, MessageCircle, Zap, Users, Lightbulb, ChevronRight } from "lucide-react";

export default function ProTipsAndCommunity() {
  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div className="border border-accent/30 rounded-2xl p-8 bg-gradient-to-br from-theme-digital-green/10 to-accent/10">
        <h3 className="text-white font-bold text-2xl flex items-center gap-2">
          <Star size={24} className="text-accent" />
          Pro Writing Tips
        </h3>
        <ul className="mt-6 space-y-4">
          {[
            "Keep headlines under 60 characters for better engagement",
            "Use active voice to create stronger, more direct messaging",
            "Break content into scannable sections with clear headers",
            "Add visuals or graphics every 300 words for visual interest",
            "Include a clear call-to-action at the end of articles",
          ].map((tip, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-gray-300">
              <span className="text-accent flex-shrink-0 font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Community Section */}
      <div className="border border-accent/30 rounded-2xl p-8 bg-gradient-to-br from-accent/10 to-theme-digital-green/10">
        <h3 className="text-white font-bold text-2xl flex items-center gap-2">
          <MessageCircle size={24} className="text-accent" />
          Join Our Community
        </h3>
        <p className="text-gray-300 mt-4 text-base">
          Connect with 2,400+ networking professionals, share insights, and grow your network together.
        </p>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-300">
            <Zap size={16} className="text-accent" />
            <span>Daily networking tips & strategies</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Users size={16} className="text-accent" />
            <span>Direct access to industry experts</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Lightbulb size={16} className="text-accent" />
            <span>Exclusive case studies and resources</span>
          </div>
        </div>
        <button className="mt-6 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-accent to-theme-digital-green text-black hover:opacity-90 transition text-sm font-semibold flex items-center justify-center gap-2">
          Join Discord Community <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}