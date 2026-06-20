import LandingSection from './shared/LandingSection';
import SectionHeader from './shared/SectionHeader';
import IconCard from './shared/IconCard';
import { missionVisionItems } from '@/lib/landingContent';

export default function MissionVisionSection() {
  return (
    <LandingSection id="mision-vision" variant="dark">
      <SectionHeader
        eyebrow="Misión y visión"
        title="Tecnología legal con precisión, seguridad y escalabilidad."
        theme="dark"
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {missionVisionItems.map((item) => (
          <IconCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
            variant="dark"
            iconSize={28}
          />
        ))}
      </div>
    </LandingSection>
  );
}
