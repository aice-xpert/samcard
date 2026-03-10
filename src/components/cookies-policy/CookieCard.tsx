"use client";
import { motion } from "motion/react";
import { bodyTextClass, mutedBodyTextClass, subsectionTitleClass } from "./typography";

interface CookieCardProps {
  icon: React.ComponentType<{ className?: string }>;
  index: number;
  title: string;
  description: string;
  purpose: string[];
  extras: { label: string; value: string }[];
  canDisable: boolean;
}

function CookieCard({ icon: Icon, index, title, description, purpose, extras, canDisable }: CookieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-accent/30 hover:bg-white/[0.07] transition-all"
    >
      <div className="flex items-start gap-3">
        <Icon className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-3">
          <h3 className={subsectionTitleClass}>{title}</h3>
          <p className={bodyTextClass}>{description}</p>
          <div className={`${mutedBodyTextClass} space-y-2 pt-1`}>
            <p className="font-medium text-white">Purpose:</p>
            <ul className="space-y-1 ml-4">
              {purpose.map((p: string) => (
                <li key={p} className="flex gap-2">
                  <span className="text-accent">›</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            {extras.map(({ label, value }: { label: string; value: string }) => (
              <p key={label}>
                <strong className="text-white">{label}:</strong>{" "}
                <span>{value}</span>
              </p>
            ))}
            <p>
              <strong className="text-white">Can be disabled:</strong>{" "}
              <span className={canDisable ? "text-accent" : "text-red-400"}>
                {canDisable ? "Yes" : "No — Required for site functionality"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CookieCard;