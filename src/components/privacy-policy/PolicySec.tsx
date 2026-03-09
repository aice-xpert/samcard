import { type ReactNode, type ComponentType, type CSSProperties } from 'react';

type PolicySectionProps = {
  id?: string;
  icon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  title: string;
  children: ReactNode;
};

export function PolicySection({ id, icon: Icon, title, children }: PolicySectionProps) {
  return (
    <div id={id} className="space-y-6">
      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(0, 180, 0, 0.08)',
              border: '1px solid rgba(0, 180, 0, 0.3)',
            }}
          >
            <Icon className="w-6 h-6 text-green-400" />
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