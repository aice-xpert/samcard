import { type ReactNode } from 'react';

type PolicyCalloutProps = {
  variant?: 'accent' | 'subtle';
  children: ReactNode;
};

export function PolicyCallout({ variant = 'subtle', children }: PolicyCalloutProps) {
  const style =
    variant === 'accent'
      ? {
          background: 'rgba(0, 180, 0, 0.08)',
          border: '1px solid rgba(0, 180, 0, 0.3)',
        }
      : {
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(0, 180, 0, 0.2)',
        };

  return (
    <div className="p-5 rounded-xl" style={style}>
      <div className="text-gray-300">{children}</div>
    </div>
  );
}