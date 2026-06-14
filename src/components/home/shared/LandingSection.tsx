import type { ReactNode } from 'react';

type Variant = 'white' | 'blue' | 'dark';

const variantClasses: Record<Variant, string> = {
  white: 'scroll-mt-36 bg-white px-6 py-20 lg:px-8',
  blue: 'scroll-mt-36 bg-brand-blue-50 px-6 py-20 lg:px-8',
  dark: 'scroll-mt-36 bg-brand-neutral-900 px-6 py-20 lg:px-8',
};

export default function LandingSection({
  id,
  variant = 'white',
  children,
}: {
  id: string;
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <section id={id} className={variantClasses[variant]}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
