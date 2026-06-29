import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';
import SectionHeading from '@/components/SectionHeading';
import SkillTag from '@/components/SkillTag';
import type { SkillCategory } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Languages',
    skills: ['Python', 'JavaScript', 'Java', 'PHP', 'SQL', 'HTML/CSS'],
  },
  {
    name: 'AI & Machine Learning',
    skills: ['Scikit-learn', 'Pandas', 'NumPy', 'ONNX', 'TensorFlow', 'Deep Learning'],
  },
  {
    name: 'Frameworks & Tools',
    skills: ['Django', 'Laravel', 'Git', 'GitHub', 'VS Code', 'Google Colab'],
  },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const categories = categoriesRef.current;
    if (!section || !categories) return;

    const categoryEls = categories.querySelectorAll('.skill-category');

    categoryEls.forEach((cat) => {
      const title = cat.querySelector('.category-title');
      const tags = cat.querySelectorAll('.skill-tag');

      gsap.set(title, { opacity: 0, y: 20 });
      gsap.set(tags, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cat,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      tl.to(title, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }).to(
        tags,
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.03,
          ease: 'power2.out',
        },
        '-=0.3'
      );
    });

    return () => {
      ScrollTrigger.getAll()
        .filter((st) => st.vars.trigger && categories.contains(st.vars.trigger as Element))
        .forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="bg-obsidian border-y border-graphite"
    >
      <div className="section-gap page-padding" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionLabel text="02 — TECH STACK" />
        <SectionHeading text="Languages & Tools" className="mb-12" />

        <div
          ref={categoriesRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {SKILL_CATEGORIES.map((category) => (
            <div key={category.name} className="skill-category">
              <h3 className="category-title font-body text-xl font-medium text-[#F5F5F5]">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2.5 mt-4">
                {category.skills.map((skill) => (
                  <div key={skill} className="skill-tag">
                    <SkillTag skill={skill} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
