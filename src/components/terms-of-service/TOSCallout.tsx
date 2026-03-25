import { type ReactNode } from 'react';

type ToSCalloutProps = {
  variant?: 'warning' | 'info';
  children: ReactNode;
};

export function ToSCallout({ variant = 'info', children }: ToSCalloutProps) {
  const style =
    variant === 'warning'
      ? {
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }
      : {
          background: 'bg-theme-devil-green',
          border: 'bg-theme-kelly-green',
        };

  return (
    <div className="p-5 rounded-lg" style={style}>
      <div className="text-gray-300">{children}</div>
    </div>
  );
}