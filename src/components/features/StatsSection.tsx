"use client";
import { useTheme } from "@/contexts/ThemeContext";

export default function StatsSection() {
  const { isDark } = useTheme();
  const stats = [
    { value: "50+", label: "Features Available" },
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "24/7", label: "Customer Support" },
    { value: "100K+", label: "Active Users" },
  ];

  return (
    <section className={`py-20 ${
      isDark ? "bg-black" : "bg-gradient-to-b from-white via-[#f0f8f0] to-[#e8f3e8]"
    }`}>
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="text-4xl font-bold text-theme-devil-green">
              {stat.value}
            </div>
            <div className="text-muted-foreground mt-2">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}