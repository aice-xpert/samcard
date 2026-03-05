import { additionalFeatures } from "@/constant";

export default function AdditionalFeatures() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          And There's More
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/5 rounded-2xl p-8 border border-white/10 flex items-start gap-6 hover:border-theme-devil-green/60 transition-all"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-theme-devil-green rounded-lg flex items-center justify-center">
                  <Icon className="text-white" size={28} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
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