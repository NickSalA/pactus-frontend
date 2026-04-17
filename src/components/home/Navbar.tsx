import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="flex flex-col gap-4 border-b border-gray-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-12">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo-contractAI-azul.png"
          alt="ContractAI Logo"
          width={36}
          height={36}
          priority
        />
        <span className="text-2xl font-semibold">ContractAI</span>
      </Link>

      <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-600 sm:justify-end">
        <Link href="/privacy-policy" className="transition-colors hover:text-slate-950">
          Política de Privacidad
        </Link>
        <Link href="/terms-of-service" className="transition-colors hover:text-slate-950">
          Términos de Servicio
        </Link>
      </nav>
    </header>
  );
}
