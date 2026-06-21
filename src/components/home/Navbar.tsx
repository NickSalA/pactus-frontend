'use client';

import { Handshake } from 'lucide-react';
import Link from 'next/link';
import { navItems } from '@/lib/landingContent';
import { useSmoothScroll } from './shared/useSmoothScroll';

export default function Navbar() {
  const scrollToSection = useSmoothScroll(132);

  return (
    <header className="sticky top-0 z-30 border-b border-brand-neutral-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue-50 text-brand-primary ring-1 ring-brand-blue-100">
            <Handshake size={26} />
          </span>
          <span className="text-display-large-logo text-brand-primary">
            Pactus
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-brand-neutral-600 lg:justify-end">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => {
                if (item.href.startsWith('#')) {
                  scrollToSection(event, item.href);
                }
              }}
              className="rounded-full px-3 py-2 transition-colors hover:bg-brand-blue-50 hover:text-brand-primary"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-full bg-brand-primary px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-brand-primary-dark"
          >
            Iniciar sesión
          </Link>
        </nav>
      </div>
    </header>
  );
}
