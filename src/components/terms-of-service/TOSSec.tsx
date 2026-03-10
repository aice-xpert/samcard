import { type ReactNode, type ComponentType, type CSSProperties } from 'react';

type ToSSectionProps = {
  id?: string;
  icon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  title: string;
  children: ReactNode;
};

export function ToSSection({ id, icon: Icon, title, children }: ToSSectionProps) {
  return (
    <div id={id} className="space-y-6">
      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className="flex-shrink-0 w-12 h-12 rounded-lg flex bg-theme-devil-green/50 border border-theme-kelly-green items-center justify-center"
          >
            <Icon className="w-6 h-6 text-theme-kelly-green" />
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