import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ActiveSectionProvider, useActiveSection } from '@/context/ActiveSectionContext';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import Navigation from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import SkillsSection from '@/sections/SkillsSection';
import ProjectsSection from '@/sections/ProjectsSection';
import CertificationsSection from '@/sections/CertificationsSection';
import CommunitySection from '@/sections/CommunitySection';
import ContactSection from '@/sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);

function SectionTracker({ id, children }: { id: string; children: React.ReactNode }) {
  const { setActiveSection } = useActiveSection();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: `#${id}`,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveSection(id),
      onEnterBack: () => setActiveSection(id),
    });

    return () => {
      trigger.kill();
    };
  }, [id, setActiveSection]);

  return <>{children}</>;
}

function AppContent() {
  return (
    <>
      <CustomCursor />
      <Navigation />

      <main>
        <SectionTracker id="hero">
          <HeroSection />
        </SectionTracker>

        <SectionTracker id="about">
          <AboutSection />
        </SectionTracker>

        <SectionTracker id="skills">
          <SkillsSection />
        </SectionTracker>

        <SectionTracker id="projects">
          <ProjectsSection />
        </SectionTracker>

        <SectionTracker id="certifications">
          <CertificationsSection />
        </SectionTracker>

        <SectionTracker id="community">
          <CommunitySection />
        </SectionTracker>

        <SectionTracker id="contact">
          <ContactSection />
        </SectionTracker>
      </main>
    </>
  );
}

export default function App() {
  return (
    <ActiveSectionProvider>
      <SmoothScrollProvider>
        <AppContent />
      </SmoothScrollProvider>
    </ActiveSectionProvider>
  );
}
