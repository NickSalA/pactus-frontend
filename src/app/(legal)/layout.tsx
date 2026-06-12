import Link from 'next/link';
import { Handshake } from 'lucide-react';

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-brand-blue-50/60 to-white text-brand-neutral-900">
      <header className="border-b border-brand-neutral-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue-50 text-brand-primary ring-1 ring-brand-blue-100">
              <Handshake size={26} />
            </span>
            <span className="text-display-large-logo text-brand-primary">
              Pactus
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-3 text-sm text-brand-neutral-600">
            <Link
              href="/"
              className="rounded-full px-3 py-2 transition-colors hover:bg-brand-blue-50 hover:text-brand-primary"
            >
              Inicio
            </Link>
            <Link
              href="/privacy-policy"
              className="rounded-full px-3 py-2 transition-colors hover:bg-brand-blue-50 hover:text-brand-primary"
            >
              Privacidad
            </Link>
            <Link
              href="/terms-of-service"
              className="rounded-full px-3 py-2 transition-colors hover:bg-brand-blue-50 hover:text-brand-primary"
            >
              Términos
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-brand-primary px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-brand-primary-dark"
            >
              Iniciar sesión
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-brand-neutral-200 bg-white p-6 shadow-2xl shadow-brand-primary/10 sm:p-10 lg:p-12">
          {children}
        </div>
      </div>

      <footer className="border-t border-brand-neutral-200 bg-white/75 px-6 py-8 text-sm text-brand-neutral-500 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span>(c) {new Date().getFullYear()} Pactus. Todos los derechos reservados.</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="hover:text-brand-primary">
              Política de Privacidad
            </Link>
            <Link href="/terms-of-service" className="hover:text-brand-primary">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
