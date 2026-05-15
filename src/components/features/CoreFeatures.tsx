"use client";
import { mainFeatures } from "@/constant";
import { useTheme } from "@/contexts/ThemeContext";

export default function CoreFeatures() {
  const { isDark } = useTheme();
  return (
    <section className={`py-20 ${
      isDark ? "bg-black" : "bg-gradient-to-b from-white via-[#f0f8f0] to-[#e8f3e8]"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-foreground text-center mb-16">
          Core Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`rounded-2xl p-8 border transform transition duration-300 hover:-translate-y-2 
                           hover:scale-105 cursor-pointer ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white border-gray-200 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="w-14 h-14 bg-theme-devil-green rounded-xl flex items-center justify-center mb-6
                                transition-colors duration-300 hover:bg-green-600">
                  <Icon className="text-white" size={28} />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3 transition-colors duration-300 hover:text-theme-devil-green">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground mb-6">{feature.description}</p>

                <ul className="space-y-2">
                  {feature.highlights.map((item, idx) => (
                    <li key={idx} className={`text-sm transition-colors duration-300 ${
                      isDark
                        ? "text-muted-foreground hover:text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}>
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}