import type { LucideIcon } from 'lucide-react';
import type { ElementType } from 'react';

type Variant = 'light' | 'hover' | 'dark';

const variantCard: Record<Variant, string> = {
  light: 'rounded-3xl border border-brand-neutral-200 bg-brand-neutral-50 p-6',
  hover:
    'group rounded-3xl border border-brand-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-blue-200 hover:shadow-xl hover:shadow-brand-primary/10',
  dark: 'rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/10',
};

const variantIconBox: Record<Variant, string> = {
  light: 'bg-brand-blue-100 text-brand-primary',
  hover:
    'bg-brand-blue-50 text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white',
  dark: 'bg-white text-brand-primary',
};

const variantTitle: Record<Variant, string> = {
  light: 'text-xl font-semibold text-brand-neutral-900',
  hover: 'text-lg font-semibold text-brand-neutral-900',
  dark: 'text-2xl font-semibold text-white',
};

const variantDesc: Record<Variant, string> = {
  light: 'mt-3 leading-7 text-brand-neutral-600',
  hover: 'mt-3 text-sm leading-6 text-brand-neutral-600',
  dark: 'mt-4 text-lg leading-8 text-white/75',
};

export default function IconCard({
  icon,
  title,
  description,
  variant = 'hover',
  iconSize = 24,
}: {
  icon: ElementType | LucideIcon;
  title: string;
  description: string;
  variant?: Variant;
  iconSize?: number;
}) {
  const Icon = icon;

  return (
    <article className={variantCard[variant]}>
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${variantIconBox[variant]}`}
      >
        <Icon size={iconSize} />
      </div>
      <h3 className={variantTitle[variant]}>{title}</h3>
      <p className={variantDesc[variant]}>{description}</p>
    </article>
  );
}
