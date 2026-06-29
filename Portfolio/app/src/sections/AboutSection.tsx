import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';
import SectionHeading from '@/components/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    if (!section || !image || !content) return;

    const paragraphs = content.querySelectorAll('.about-animate');
    const quote = content.querySelector('.quote-animate');
    const eduInfo = content.querySelector('.edu-animate');

    gsap.set(paragraphs, { opacity: 0, y: 30 });
    if (quote) gsap.set(quote, { opacity: 0, x: -20 });
    if (eduInfo) gsap.set(eduInfo, { opacity: 0, y: 20 });
    gsap.set(image, { clipPath: 'inset(100% 0 0 0)' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.to(image, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.2,
      ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
    })
      .to(
        paragraphs,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
        },
        '-=0.8'
      )
      .to(
        quote,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
        },
        '-=0.4'
      )
      .to(
        eduInfo,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.3'
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-gap page-padding"
      style={{ maxWidth: '1280px', margin: '0 auto' }}
    >
      <SectionLabel text="01 — ABOUT" />
      <SectionHeading text="Discipline, Code &\nImpact" className="mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-16">
        <div ref={contentRef} className="order-2 md:order-1">
          <p className="about-animate text-[15px] leading-relaxed text-[#CFCFCF]">
            Second-year student in Artificial Intelligence at IFRI, Université d'Abomey-Calavi.
            I focus on Machine Learning, Deep Learning, and Data Science — turning complex problems
            into software that works.
          </p>

          <p className="about-animate text-[15px] leading-relaxed text-[#CFCFCF] mt-4">
            From music recommendation engines using MusiCNN and ONNX to secure multi-channel
            authentication systems, I build at the intersection of research and production.
          </p>

          <p className="about-animate text-[15px] leading-relaxed text-[#CFCFCF] mt-4">
            Active in Benin's AI community through IndabaX and BWAI. I mentor new students and
            contribute to open-source projects that demystify machine learning.
          </p>

          <div className="quote-animate flex items-start gap-4 mt-8">
            <div className="w-[2px] h-8 bg-[#B5423F] shrink-0 mt-1" />
            <p className="font-display italic text-xl text-[#B5423F]">
              "La simplicité est la sophistication suprême." — Léonard de Vinci
            </p>
          </div>

          <div className="edu-animate mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373]">
              LICENCE IN ARTIFICIAL INTELLIGENCE
            </p>
            <p className="text-[15px] text-[#CFCFCF] mt-1">
              IFRI — Université d'Abomey-Calavi
            </p>
            <p className="font-mono text-[11px] text-[#737373] mt-1">
              2024 – Present | 2nd Year
            </p>
          </div>
        </div>

        <div ref={imageRef} className="order-1 md:order-2 overflow-hidden">
          <img
            src="/images/profile.jpg"
            alt="Seth N. AKPLOGAN portrait"
            className="w-full object-cover aspect-[3/4] grayscale-[30%] hover:grayscale-0 hover:scale-[1.02] transition-all duration-400"
            style={{ filter: 'grayscale(0.3)' }}
            onMouseEnter={(e) => {
              (e.target as HTMLImageElement).style.filter = 'grayscale(0)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLImageElement).style.filter = 'grayscale(0.3)';
            }}
          />
        </div>
      </div>
    </section>
  );
}
