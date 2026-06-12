import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-brand-blue-50/60 to-white">
      <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-primary/10 blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-blue-200 bg-white px-4 py-2 text-sm font-medium text-brand-primary shadow-sm">
            <Sparkles size={16} />
            IA contractual con respuestas basadas en documentos reales
          </span>

          <h1 className="text-5xl font-bold leading-[1.02] tracking-tight text-brand-neutral-900 sm:text-6xl lg:text-7xl">
            Inteligencia para los{' '}
            <span className="text-brand-primary">Contratos Modernos</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-brand-neutral-600 sm:text-xl">
            Pactus automatiza la gestión contractual con inteligencia artificial
            y arquitectura RAG, permitiendo consultar, analizar y generar
            documentos con respuestas fundamentadas en tus propios contratos.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-7 py-4 text-base font-semibold text-white shadow-lg shadow-brand-primary/20 transition-colors hover:bg-brand-primary-dark"
            >
              Iniciar sesión
              <ArrowRight size={18} />
            </Link>
            <Link
              href="#capacidades"
              className="inline-flex items-center justify-center rounded-2xl border border-brand-neutral-300 bg-white px-7 py-4 text-base font-semibold text-brand-neutral-800 transition-colors hover:border-brand-blue-200 hover:bg-brand-blue-50 hover:text-brand-primary"
            >
              Conocer capacidades
            </Link>
          </div>

          <div className="mt-10 grid gap-3 text-sm text-brand-neutral-600 sm:grid-cols-3">
            {['Gestión contractual', 'Agente IA con RAG', 'Control por roles'].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="text-brand-green-600" size={18} />
                  <span>{item}</span>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-brand-primary/10 blur-2xl" />
          <div className="relative rounded-[2rem] border border-brand-blue-100 bg-white p-3 shadow-2xl shadow-brand-primary/10">
            <Image
              src="/imagen-ContractAI-laptop.png"
              alt="Vista de la plataforma Pactus"
              width={750}
              height={600}
              className="rounded-[1.4rem]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
