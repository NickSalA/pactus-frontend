import Link from 'next/link';
import { Handshake } from 'lucide-react';

export default function BrandMark({
  variant = 'dark',
  href = '/',
}: {
  variant?: 'light' | 'dark';
  href?: string;
}) {
  const iconBg =
    variant === 'light'
      ? 'bg-white text-brand-primary'
      : 'bg-brand-blue-50 text-brand-primary ring-1 ring-brand-blue-100';

  const textColor =
    variant === 'light' ? 'text-white' : 'text-brand-primary';

  return (
    <Link href={href} className="flex items-center gap-3">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg}`}
      >
        <Handshake size={26} />
      </span>
      <span className={`text-display-large-logo ${textColor}`}>Pactus</span>
    </Link>
  );
}
