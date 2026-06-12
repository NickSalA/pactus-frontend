import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCtaSection() {
  return (
    <section className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-brand-blue-100 bg-gradient-to-br from-brand-blue-50 to-white p-8 text-center shadow-xl shadow-brand-primary/5 lg:p-12">
        <h2 className="text-4xl font-bold tracking-tight text-brand-neutral-900 sm:text-5xl">
          Moderniza la gestión contractual de tu organización
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-brand-neutral-600">
          Centraliza contratos, automatiza análisis y consulta información legal
          con inteligencia artificial fundamentada en tus propios documentos.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-7 py-4 font-semibold text-white transition-colors hover:bg-brand-primary-dark"
          >
            Iniciar sesión
            <ArrowRight size={18} />
          </Link>
          <Link
            href="#contacto"
            className="inline-flex items-center justify-center rounded-2xl border border-brand-neutral-300 bg-white px-7 py-4 font-semibold text-brand-neutral-800 transition-colors hover:border-brand-blue-200 hover:bg-brand-blue-50 hover:text-brand-primary"
          >
            Contactar
          </Link>
        </div>
      </div>
    </section>
  );
}
