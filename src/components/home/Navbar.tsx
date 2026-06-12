'use client';

import Link from 'next/link';
import { Handshake } from 'lucide-react';

const navItems = [
  { href: '#quienes-somos', label: 'Quiénes somos' },
  { href: '#mision-vision', label: 'Misión y visión' },
  { href: '#capacidades', label: 'Capacidades' },
  { href: '#ia-rag', label: 'IA RAG' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Navbar() {
  const scrollToSection = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    event.preventDefault();

    const section = document.querySelector(href);

    if (!section) return;

    const navbarOffset = 132;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: sectionTop - navbarOffset,
      behavior: 'smooth',
    });

    window.history.pushState(null, '', href);
  };

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
              onClick={(event) => scrollToSection(event, item.href)}
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
