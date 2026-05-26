import Link from 'next/link';
import Image from 'next/image';
import { Handshake } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="flex flex-col gap-4 border-b border-gray-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-12">
      <Link href="/" className="flex items-center gap-3">
        <Handshake className="text-brand-primary" size={32} />
        <span className="text-body-main-bold text-brand-primary font-semibold">
          Pactus
        </span>
      </Link>

      <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-600 sm:justify-end">
        <Link
          href="/privacy-policy"
          className="transition-colors hover:text-slate-950"
        >
          Política de Privacidad
        </Link>
        <Link
          href="/terms-of-service"
          className="transition-colors hover:text-slate-950"
        >
          Términos de Servicio
        </Link>
      </nav>
    </header>
  );
}
