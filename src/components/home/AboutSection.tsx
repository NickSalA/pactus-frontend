import LandingSection from './shared/LandingSection';
import SectionHeader from './shared/SectionHeader';
import IconCard from './shared/IconCard';
import { aboutHighlights } from '@/lib/landingContent';

export default function AboutSection() {
  return (
    <LandingSection id="quienes-somos">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:items-center">
        <SectionHeader
          eyebrow="Quiénes somos"
          title="Una plataforma para transformar la gestión legal en decisiones inteligentes."
        />

        <div className="space-y-6 text-lg leading-8 text-brand-neutral-600">
          <p>
            Pactus es una plataforma integral de gestión y análisis legal
            diseñada para automatizar el ciclo de vida de los contratos mediante
            inteligencia artificial avanzada.
          </p>
          <p>
            Permite centralizar documentos, consultar información contractual en
            lenguaje natural, crear plantillas y administrar usuarios, permisos,
            alertas y servicios desde un entorno seguro para la organización.
          </p>
        </div>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {aboutHighlights.map((item) => (
          <IconCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
            variant="light"
          />
        ))}
      </div>
    </LandingSection>
  );
}
