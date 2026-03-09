import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

type PolicySectionProps = {
  id?: string;
  icon?: LucideIcon;
  title: string;
  children: ReactNode;
};

export function PolicySection({ id, icon: Icon, title, children }: PolicySectionProps) {
  return (
    <div id={id} className="space-y-6">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-theme-devil-green to-theme-kelly-green">
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4 text-white">
            {title}
          </h2>
          <div className="space-y-4 text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}