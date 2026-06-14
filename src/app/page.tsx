import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import MissionVisionSection from '@/components/home/MissionVisionSection';
import CapabilitiesSection from '@/components/home/CapabilitiesSection';
import RagAiSection from '@/components/home/RagAiSection';
import FinalCtaSection from '@/components/home/FinalCtaSection';
import ContactFooter from '@/components/home/ContactFooter';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MissionVisionSection />
      <CapabilitiesSection />
      <RagAiSection />
      <FinalCtaSection />
      <ContactFooter />
    </main>
  );
}
