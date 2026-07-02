import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
 project: Project;
 index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
 const cardRef = useRef<HTMLDivElement>(null);
 const imageRef = useRef<HTMLDivElement>(null);
 const isEven = index % 2 === 1;
 const hasImage = !!project.image;

 useEffect(() => {
 const card = cardRef.current;
 const image = imageRef.current;
 if (!card) return;

 const contentEls = card.querySelectorAll('.project-animate');

 gsap.set(contentEls, { opacity: 0, y: 40 });

 if (hasImage && image) {
  gsap.set(image, {
  clipPath: isEven ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
  });
 }

 const tl = gsap.timeline({
 scrollTrigger: {
 trigger: card,
 start: 'top 80%',
 toggleActions: 'play none none none',
 },
 });

 if (hasImage && image) {
  tl.to(image, {
  clipPath: 'inset(0 0% 0 0%)',
  duration: 1,
  ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
  });
 }

 tl.to(
 contentEls,
 {
 opacity: 1,
 y: 0,
 duration: 0.8,
 stagger: 0.15,
 ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
 },
 hasImage ? '-=0.6' : undefined
 );

 return () => {
 tl.kill();
 };
 }, [isEven, hasImage]);

 return (
 <div
 ref={cardRef}
 className={hasImage ? `grid grid-cols-1 md:grid-cols-[55%_45%] gap-12 ${
 isEven ? 'md:[direction:rtl]' : ''
 }` : `w-full max-w-4xl mx-auto`}
 >
 <div className={`flex flex-col ${isEven && hasImage ? 'md:[direction:ltr]' : ''}`}>
 <span className="project-animate font-mono text-5xl text-[#1E1E1E] leading-none">
 {project.number}
 </span>
 <h3 className="project-animate font-body text-[22px] font-medium text-[#F5F5F5] mt-4 leading-tight">
 {project.title}
 </h3>
 <span
 className="project-animate inline-block self-start font-mono text-[10px] uppercase tracking-[0.1em] mt-3 px-3 py-1"
 style={{
 color: project.status === 'completed' ? '#2F8F8F' : '#B5423F',
 backgroundColor:
 project.status === 'completed'
 ? 'rgba(47, 143, 143, 0.12)'
 : 'rgba(181, 66, 63, 0.15)',
 }}
 >
 {project.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
 </span>

 <div className="project-animate mt-6">
 <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373] mb-2">
 PROBLEM
 </p>
 <p className="text-[15px] leading-relaxed text-[#CFCFCF]">{project.problem}</p>
 </div>

 <div className="project-animate mt-5">
 <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373] mb-2">
 SOLUTION
 </p>
 <p className="text-[15px] leading-relaxed text-[#CFCFCF]">{project.solution}</p>
 </div>

 <div className="project-animate flex flex-wrap gap-2 mt-5">
 {(Array.isArray(project.tech) ? project.tech : []).map((t) => (
 <span
 key={t}
 className="font-mono text-[11px] text-[#737373] border border-[#1E1E1E] px-3 py-1.5"
 >
 {t}
 </span>
 ))}
 </div>

 <div className="project-animate flex gap-4 mt-5">
 {project.githubUrl && (
 <a
 href={project.githubUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="text-sm text-[#B5423F] hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1"
 >
 GitHub <span>→</span>
 </a>
 )}
 {project.demoUrl && (
 <a
 href={project.demoUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="text-sm text-[#B5423F] hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1"
 >
 Live Demo <span>→</span>
 </a>
 )}
 </div>
 </div>

 {hasImage && (
 <div
 ref={imageRef}
 className={`overflow-hidden border border-[#1E1E1E] hover:border-[#737373] transition-colors duration-300 ${
 isEven ? 'md:[direction:ltr]' : ''
 }`}
 >
 <img
 src={project.image}
 alt={project.title}
 loading="lazy"
 className="w-full h-full object-cover aspect-[16/10] hover:scale-[1.03] transition-transform duration-600"
 />
 </div>
 )}
 </div>
 );
}
