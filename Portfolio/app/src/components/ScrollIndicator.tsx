import { useEffect, useState } from 'react';

export default function ScrollIndicator() {
 const [hidden, setHidden] = useState(false);

 useEffect(() => {
 const handleScroll = () => {
 setHidden(window.scrollY > 100);
 };
 window.addEventListener('scroll', handleScroll, { passive: true });
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 return (
 <div
 className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
 style={{ opacity: hidden ? 0 : 0.5 }}
 >
 <div className="relative w-[1px] h-10 bg-[#1E1E1E]">
 <div
 className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B5423F]"
 style={{ animation: 'scroll-dot 2s ease-in-out infinite' }}
 />
 </div>
 <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373]">
 SCROLL
 </span>
 </div>
 );
}
