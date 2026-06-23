import LandingSection from './shared/LandingSection';
import { ragFlow, ragFeatures } from '@/lib/landingContent';

export default function RagAiSection() {
  return (
    <LandingSection id="ia-rag" variant="blue">
      <div className="overflow-hidden rounded-[2.5rem] bg-brand-primary p-8 text-white shadow-2xl shadow-brand-primary/20 lg:p-12">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue-100">
              Arquitectura RAG + IA
            </span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              IA que entiende tus contratos, no respuestas genéricas.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/80">
              El agente de Pactus combina búsqueda vectorial, contexto
              organizacional y modelos generativos para responder preguntas
              legales y operativas usando la información real de tus contratos.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-4">
              {ragFlow.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="relative">
                    <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl bg-white p-4 text-center text-brand-neutral-900">
                      <Icon className="mb-3 text-brand-primary" size={26} />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </div>
                    {index < ragFlow.length - 1 && (
                      <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-white/60 sm:block">
                        {'>'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {ragFeatures.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/85"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
