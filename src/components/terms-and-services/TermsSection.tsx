import { CheckCircle, Mail, Phone, MapPin } from "lucide-react";

type Contact = {
  email: string;
  phone: string;
  address: string;
};

type Section = {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
  paragraphs?: string[];
  checklist?: string[];
  bullets?: string[];
  contact?: Contact;
};

export default function TermsSection({ section }: { section: Section }) {
  const Icon = section.icon;

  return (
    <div id={`section-${section.id}`} className="scroll-mt-24">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-theme-devil-green to-theme-kelly-green rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="text-white" size={28} />
        </div>

        <div className="flex-1">
          <h2 className="text-white text-3xl font-bold mb-6">
            {section.id}. {section.title}
          </h2>

          <div className="text-gray-400 space-y-4 leading-relaxed">
            {section.paragraphs?.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            {section.checklist && (
              <ul className="space-y-2 ml-4">
                {section.checklist.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckCircle className="text-theme-kelly-green" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.bullets && (
              <ul className="list-disc ml-6 space-y-1">
                {section.bullets.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}