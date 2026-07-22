import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ActiveSectionProvider, useActiveSection } from '@/context/ActiveSectionContext';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import Navigation from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';
import PageLoader from '@/components/PageLoader';
// Homepage sections — statically imported to guarantee optimal FCP/LCP
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import SkillsSection from '@/sections/SkillsSection';
import ProjectsSection from '@/sections/ProjectsSection';
import CertificationsSection from '@/sections/CertificationsSection';
import CommunitySection from '@/sections/CommunitySection';
import ContactSection from '@/sections/ContactSection';
import SEO from '@/components/SEO';

// ─── Lazy-loaded routes ────────────────────────────────────────────────────────
// These pages are never needed for the initial homepage render.
// Each will form its own chunk via Vite's manualChunks config.
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const Articles = lazy(() => import('@/pages/Articles'));
const ArticleDetail = lazy(() => import('@/pages/ArticleDetail'));


gsap.registerPlugin(ScrollTrigger);

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://seth-akplogan.onrender.com/#person',
      name: 'Seth N. AKPLOGAN',
      jobTitle: 'Artificial Intelligence & Data Science Student',
      description: 'AI & Data Science student at IFRI, Université d\'Abomey-Calavi. Building reliable and intelligent software solutions.',
      worksFor: {
        '@type': 'EducationalOrganization',
        name: "IFRI — Université d'Abomey-Calavi",
      },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: "IFRI — Institut de Formation et de Recherche en Informatique",
      },
      knowsAbout: [
        'Artificial Intelligence',
        'Machine Learning',
        'Data Science',
        'Deep Learning',
        'Natural Language Processing',
        'Full-Stack Software Engineering',
        'Python',
        'TypeScript',
        'React',
        'Node.js',
        'PostgreSQL',
      ],
      url: 'https://seth-akplogan.onrender.com',
      sameAs: [
        'https://linkedin.com/in/seth-akplogan',
        'https://github.com/Flex1-tech',
      ],
      subjectOf: {
        '@type': 'WebDocument',
        url: 'https://seth-akplogan.onrender.com/llms.txt',
        name: 'LLMs.txt Summary',
      },
    },
    {
      '@type': 'ProfilePage',
      '@id': 'https://seth-akplogan.onrender.com/#webpage',
      url: 'https://seth-akplogan.onrender.com',
      name: 'Seth N. AKPLOGAN — AI & Data Science Portfolio',
      mainEntity: {
        '@id': 'https://seth-akplogan.onrender.com/#person',
      },
    },
  ],
};

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
 <SEO jsonLd={homeSchema} />
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
 return (
 <QueryClientProvider client={queryClient}>
 <BrowserRouter>
 <ActiveSectionProvider>
 <Routes>
   {/* Homepage — no Suspense needed, all imports are static */}
   <Route path="/" element={
     <SmoothScrollProvider>
       <AppContent />
     </SmoothScrollProvider>
   } />

   {/* Article routes — lazy loaded (includes react-markdown chunk) */}
   <Route path="/articles" element={
     <Suspense fallback={<PageLoader />}>
       <Articles />
     </Suspense>
   } />
   <Route path="/articles/:slug" element={
     <Suspense fallback={<PageLoader />}>
       <ArticleDetail />
     </Suspense>
   } />

   {/* Admin routes — lazy loaded (largest chunk, never visited by public) */}
   <Route path="/admin/login" element={
     <Suspense fallback={<PageLoader />}>
       <AdminLogin />
     </Suspense>
   } />
   <Route path="/admin/dashboard" element={
     <Suspense fallback={<PageLoader />}>
       <AdminDashboard />
     </Suspense>
   } />

   <Route path="*" element={<Navigate to="/" replace />} />
 </Routes>
 </ActiveSectionProvider>
 </BrowserRouter>
 </QueryClientProvider>
 );
}
