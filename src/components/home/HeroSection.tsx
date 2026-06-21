import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import FeaturePill from './shared/FeaturePill';
import CtaButton from './shared/CtaButton';
import { heroHighlights } from '@/lib/landingContent';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-brand-blue-50/60 to-white">
      <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-primary/10 blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <FeaturePill variant="pill" icon={Sparkles}>
            IA contractual con respuestas basadas en documentos reales
          </FeaturePill>

          <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight text-brand-neutral-900 sm:text-6xl lg:text-7xl">
            Inteligencia para los{' '}
            <span className="text-brand-primary">Contratos Modernos</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-brand-neutral-600 sm:text-xl">
            Pactus automatiza la gestión contractual con inteligencia artificial
            y arquitectura RAG, permitiendo consultar, analizar y generar
            documentos con respuestas fundamentadas en tus propios contratos.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <CtaButton href="/login" variant="primary" showArrow>
              Iniciar sesión
            </CtaButton>
            <CtaButton href="#capacidades" variant="secondary">
              Conocer capacidades
            </CtaButton>
          </div>

          <div className="mt-10 grid gap-3 text-sm text-brand-neutral-600 sm:grid-cols-3">
            {heroHighlights.map((item) => (
              <FeaturePill key={item}>{item}</FeaturePill>
            ))}
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
