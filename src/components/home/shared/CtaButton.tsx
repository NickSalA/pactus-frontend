import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'nav';

const classes: Record<Variant, string> = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-7 py-4 text-base font-semibold text-white shadow-lg shadow-brand-primary/20 transition-colors hover:bg-brand-primary-dark',
  secondary:
    'inline-flex items-center justify-center rounded-2xl border border-brand-neutral-300 bg-white px-7 py-4 text-base font-semibold text-brand-neutral-800 transition-colors hover:border-brand-blue-200 hover:bg-brand-blue-50 hover:text-brand-primary',
  nav: 'rounded-full bg-brand-primary px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-brand-primary-dark',
};

export default function CtaButton({
  href,
  children,
  variant = 'primary',
  showArrow = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  showArrow?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`${classes[variant]} ${className ?? ''}`}>
      {children}
      {showArrow && <ArrowRight size={18} />}
    </Link>
  );
}
