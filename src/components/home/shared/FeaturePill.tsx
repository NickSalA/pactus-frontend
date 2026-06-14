import type { LucideIcon } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import type { ElementType, ReactNode } from 'react';

export default function FeaturePill({
  children,
  icon,
  variant = 'dot',
}: {
  children: ReactNode;
  icon?: ElementType | LucideIcon;
  variant?: 'pill' | 'dot';
}) {
  if (variant === 'pill') {
    const Icon = icon;

    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue-200 bg-white px-4 py-2 text-sm font-medium text-brand-primary shadow-sm">
        {Icon && <Icon size={16} />}
        {children}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="text-brand-green-600" size={18} />
      <span>{children}</span>
    </div>
  );
}
