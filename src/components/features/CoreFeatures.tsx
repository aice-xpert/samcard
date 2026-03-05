import { mainFeatures } from "@/constant";

export default function CoreFeatures() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Core Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/5 rounded-2xl p-8 border border-white/10"
              >
                <div className="w-14 h-14 bg-theme-devil-green rounded-xl flex items-center justify-center mb-6">
                  <Icon className="text-white" size={28} />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-400 mb-6">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.highlights.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-400">
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