import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import AsciiCanvas from '@/components/AsciiCanvas';
import ScrollIndicator from '@/components/ScrollIndicator';
import { getProfile } from '@/services/api';
import type { ProfileSettings } from '@/services/api';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const punchlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const [profile, setProfile] = useState<ProfileSettings>({});

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {});
  }, []);

  useEffect(() => {
    document.fonts.ready.then(() => {
      const headline = headlineRef.current;
      if (!headline) return;

      const words = headline.textContent?.split(' ') || [];
      headline.innerHTML = '';
      const wordSpans: HTMLSpanElement[] = [];

      words.forEach((word, i) => {
        const wrapper = document.createElement('span');
        wrapper.style.display = 'inline-block';
        wrapper.style.overflow = 'hidden';
        wrapper.style.verticalAlign = 'top';

        const inner = document.createElement('span');
        inner.textContent = word;
        inner.style.display = 'inline-block';
        inner.style.transform = 'translateY(120%)';
        inner.style.opacity = '0';

        wrapper.appendChild(inner);
        headline.appendChild(wrapper);

        if (i < words.length - 1) {
          const space = document.createElement('span');
          space.innerHTML = '&nbsp;';
          space.style.display = 'inline-block';
          headline.appendChild(space);
        }

        wordSpans.push(inner);
      });

      const tl = gsap.timeline({ delay: 0.4 });

      tl.to(wordSpans, {
        y: '0%',
        opacity: 1,
        duration: 1,
        stagger: 0.06,
        ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
      });

      if (labelRef.current) {
        gsap.to(labelRef.current, { opacity: 1, duration: 0.5, delay: 0.3 });
      }
      if (subtitleRef.current) {
        gsap.to(subtitleRef.current, {
          opacity: 1, y: 0, duration: 0.8, delay: 0.8,
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
        });
      }
      if (punchlineRef.current) {
        gsap.to(punchlineRef.current, {
          opacity: 1, y: 0, duration: 0.8, delay: 0.95,
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
        });
      }
      if (ctaRef.current) {
        gsap.to(ctaRef.current.children, {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 1.1,
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
        });
      }
    });
  }, [profile.username]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col justify-center page-padding"
      style={{ paddingTop: '64px' }}
    >
      <AsciiCanvas />

      <div className="relative" style={{ zIndex: 10 }}>
        <p
          ref={labelRef}
          className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373] mb-10"
          style={{ opacity: 0 }}
        >
          {profile.hero_label || 'IFRI — UNIVERSITÉ D\'ABOMEY-CALAVI'}
        </p>

        <h1
          ref={headlineRef}
          className="font-display font-light uppercase text-[#F5F5F5] leading-[0.88] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(64px, 12vw, 180px)', marginBottom: '32px' }}
        >
          {profile.username || 'Seth N. AKPLOGAN'}
        </h1>

        <p
          ref={subtitleRef}
          className="font-display font-light text-2xl text-[#CFCFCF] mb-6"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          {profile.hero_title || 'Artificial Intelligence & Data Science Student'}
        </p>

        <p
          ref={punchlineRef}
          className="text-[15px] leading-relaxed text-[#CFCFCF] max-w-[560px] mb-10"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          {profile.hero_punchline || 'Building reliable and intelligent software that delivers measurable real-world value.'}
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
          <a
            href="#projects"
            className="inline-flex items-center justify-center px-7 py-3.5 bg-[#B5423F] text-[#F5F5F5] font-body text-[13px] font-medium uppercase tracking-[0.04em] hover:bg-[#C94F4B] transition-colors duration-200"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
            data-cursor-hover
          >
            Discover My Projects
          </a>
          <a
            href="/CV_Seth_AKPLOGAN.pdf"
            download
            className="inline-flex items-center justify-center px-7 py-3.5 bg-transparent border border-[#1E1E1E] text-[#CFCFCF] font-body text-[13px] font-medium uppercase tracking-[0.04em] hover:border-[#737373] hover:text-[#F5F5F5] transition-all duration-200"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
            data-cursor-hover
          >
            Download CV
          </a>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
