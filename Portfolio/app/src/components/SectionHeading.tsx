import { useCharacterReveal } from '@/hooks/useCharacterReveal';

interface SectionHeadingProps {
 text: string;
 className?: string;
}

export default function SectionHeading({ text, className = '' }: SectionHeadingProps) {
 const ref = useCharacterReveal<HTMLHeadingElement>();

 return (
 <h2
 ref={ref}
 className={`font-display font-light uppercase leading-[1.05] tracking-[-0.02em] text-[#F5F5F5] ${className}`}
 style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
 >
 {text}
 </h2>
 );
}
