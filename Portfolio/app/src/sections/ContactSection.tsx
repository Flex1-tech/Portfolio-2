import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';
import SectionHeading from '@/components/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const bodyText = content.querySelector('.contact-body');
    const links = content.querySelectorAll('.contact-link');
    const footer = content.querySelector('.contact-footer');

    gsap.set(bodyText, { opacity: 0, y: 20 });
    gsap.set(links, { opacity: 0, y: 15 });
    gsap.set(footer, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: content,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.to(bodyText, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: 0.2,
      ease: 'power2.out',
    })
      .to(
        links,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.1,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .to(
        footer,
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.2'
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-gap page-padding pb-12"
      style={{ maxWidth: '1280px', margin: '0 auto' }}
    >
      <SectionLabel text="06 — CONTACT" />
      <SectionHeading text="Let's\nConnect" className="mb-8" />

      <div ref={contentRef}>
        <p className="contact-body text-[15px] leading-relaxed text-[#CFCFCF] max-w-[480px] mb-10">
          I'm open to collaborations, internships, and research opportunities in AI and software
          engineering.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="mailto:sethakplogan@gmail.com"
            className="contact-link font-display text-2xl text-[#B5423F] hover:text-[#F5F5F5] transition-colors duration-200 w-fit"
            data-cursor-hover
          >
            sethakplogan@gmail.com
          </a>
          <a
            href="https://linkedin.com/in/seth-akplogan"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link font-display text-2xl text-[#B5423F] hover:text-[#F5F5F5] transition-colors duration-200 w-fit"
            data-cursor-hover
          >
            linkedin.com/in/seth-akplogan
          </a>
          <a
            href="https://github.com/Flex1-tech"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link font-display text-2xl text-[#B5423F] hover:text-[#F5F5F5] transition-colors duration-200 w-fit"
            data-cursor-hover
          >
            github.com/Flex1-tech
          </a>
        </div>

        {/* Social icons */}
        <div className="flex gap-6 mt-10">
          <a
            href="https://github.com/Flex1-tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#737373] hover:text-[#F5F5F5] transition-colors duration-200"
            aria-label="GitHub"
            data-cursor-hover
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/seth-akplogan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#737373] hover:text-[#F5F5F5] transition-colors duration-200"
            aria-label="LinkedIn"
            data-cursor-hover
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="mailto:sethakplogan@gmail.com"
            className="text-[#737373] hover:text-[#F5F5F5] transition-colors duration-200"
            aria-label="Email"
            data-cursor-hover
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>
        </div>

        {/* Footer */}
        <div className="contact-footer mt-24 pt-6 border-t border-graphite flex flex-col sm:flex-row justify-between gap-2">
          <p className="font-mono text-[11px] text-graphite">
            © 2025 Seth N. AKPLOGAN. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-graphite">
            Built with discipline & code.
          </p>
        </div>
      </div>
    </section>
  );
}
