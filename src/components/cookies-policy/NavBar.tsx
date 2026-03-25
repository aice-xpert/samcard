import { navTextClass } from "./typography";

export function CookiePolicyNav() {
  const links = [
    { href: "#what-are-cookies", label: "What Are Cookies" },
    { href: "#types-of-cookies", label: "Types of Cookies" },
    { href: "#how-we-use", label: "How We Use Cookies" },
    { href: "#manage-cookies", label: "Manage Cookies" },
  ];

  return (
     <section className="py-5 bg-neutral-950 border-y border-white/10">
     <div className="max-w-4xl mx-auto">
        <nav className={`flex flex-wrap justify-center gap-4 ${navTextClass}`}>
          {links.map((link, i) => (
            <span key={link.href} className="flex items-center gap-4">
              {i > 0 && <span className="text-gray-600 hidden sm:inline">•</span>}
              <a
                href={link.href}
                className="text-gray-300 hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}