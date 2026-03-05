export default function StatsSection() {
  const stats = [
    { value: "50+", label: "Features Available" },
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "24/7", label: "Customer Support" },
    { value: "100K+", label: "Active Users" },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="text-4xl font-bold text-theme-devil-green">
              {stat.value}
            </div>
            <div className="text-gray-400 mt-2">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}