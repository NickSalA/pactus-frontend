import LandingSection from './shared/LandingSection';
import SectionHeader from './shared/SectionHeader';
import IconCard from './shared/IconCard';
import { capabilities } from '@/lib/landingContent';

export default function CapabilitiesSection() {
  return (
    <LandingSection id="capacidades">
      <SectionHeader
        eyebrow="Capacidades"
        title="Todo lo necesario para operar contratos con inteligencia."
        description="Pactus reúne gestión documental, analítica, administración y agentes de IA en una plataforma enfocada en contratos modernos."
        align="center"
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((item) => (
          <IconCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
            variant="hover"
            iconSize={23}
          />
        ))}
      </div>
    </LandingSection>
  );
}
