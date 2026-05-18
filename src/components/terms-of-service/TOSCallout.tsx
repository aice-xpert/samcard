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
          background: 'rgba(0, 128, 1, 0.08)',
          border: '1px solid rgba(0, 128, 1, 0.3)',
        };

  return (
    <div className="p-5 rounded-lg" style={style}>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}