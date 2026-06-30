import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function useCharacterReveal<T extends HTMLElement>() {
 const ref = useRef<T>(null);
 const reducedMotion = useReducedMotion();

 useEffect(() => {
 if (reducedMotion || !ref.current) return;

 const el = ref.current;
 const text = el.textContent || '';
 el.innerHTML = '';

 const chars: HTMLSpanElement[] = [];
 for (let i = 0; i < text.length; i++) {
 const span = document.createElement('span');
 span.style.display = 'inline-block';
 span.style.opacity = '0';
 if (text[i] === ' ') {
 span.innerHTML = '&nbsp;';
 } else {
 span.textContent = text[i];
 }
 el.appendChild(span);
 chars.push(span);
 }

 gsap.set(chars, { opacity: 0, y: '40%' });

 const animation = gsap.to(chars, {
 opacity: 1,
 y: '0%',
 duration: 0.6,
 stagger: 0.015,
 ease: 'power2.out',
 scrollTrigger: {
 trigger: el,
 start: 'top 80%',
 toggleActions: 'play none none none',
 },
 });

 return () => {
 animation.kill();
 ScrollTrigger.getAll()
 .filter((st) => st.vars.trigger === el)
 .forEach((st) => st.kill());
 };
 }, [reducedMotion]);

 return ref;
}
