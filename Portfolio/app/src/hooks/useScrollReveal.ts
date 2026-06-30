import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
 y?: number;
 x?: number;
 opacity?: number;
 duration?: number;
 delay?: number;
 stagger?: number;
 start?: string;
 ease?: string;
}

export function useScrollReveal<T extends HTMLElement>(
 options: ScrollRevealOptions = {}
) {
 const ref = useRef<T>(null);
 const reducedMotion = useReducedMotion();

 useEffect(() => {
 if (reducedMotion || !ref.current) return;

 const {
 y = 30,
 x = 0,
 opacity = 0,
 duration = 0.8,
 delay = 0,
 stagger = 0,
 start = 'top 80%',
 ease = 'cubic-bezier(0.19, 1, 0.22, 1)',
 } = options;

 const children = stagger > 0 ? ref.current.children : ref.current;

 gsap.set(children, { y, x, opacity });

 const animation = gsap.to(children, {
 y: 0,
 x: 0,
 opacity: 1,
 duration,
 delay,
 stagger: stagger > 0 ? stagger : 0,
 ease,
 scrollTrigger: {
 trigger: ref.current,
 start,
 toggleActions: 'play none none none',
 },
 });

 return () => {
 animation.kill();
 ScrollTrigger.getAll()
 .filter((st) => st.vars.trigger === ref.current)
 .forEach((st) => st.kill());
 };
 }, [reducedMotion]);

 return ref;
}
