"use client";
import { additionalFeatures } from "@/constant";
import { useTheme } from "@/contexts/ThemeContext";

export default function AdditionalFeatures() {
  const { isDark } = useTheme();
  return (
    <section className={`py-20 ${
      isDark ? "bg-black" : "bg-gradient-to-b from-white via-[#f0f8f0] to-[#e8f3e8]"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-foreground text-center mb-16">
          And There&apos;s More
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`rounded-2xl p-8 border flex items-start gap-6 hover:border-theme-devil-green/60 transition-all ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <div className="flex-shrink-0 w-14 h-14 bg-theme-devil-green rounded-lg flex items-center justify-center">
                  <Icon className="text-white" size={28} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}