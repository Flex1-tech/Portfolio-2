import { useState, useEffect, useCallback } from 'react';
import { useActiveSection } from '@/context/ActiveSectionContext';

const NAV_LINKS = [
 { label: 'About', href: '#about' },
 { label: 'Projects', href: '#projects' },
 { label: 'Community', href: '#community' },
 { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [isVisible, setIsVisible] = useState(false);
 const { activeSection } = useActiveSection();

 useEffect(() => {
 const timer = setTimeout(() => setIsVisible(true), 200);
 return () => clearTimeout(timer);
 }, []);

 const scrollTo = useCallback(
 (href: string) => {
 setIsMenuOpen(false);
 const el = document.querySelector(href);
 if (el) {
 el.scrollIntoView({ behavior: 'smooth' });
 }
 },
 []
 );

 useEffect(() => {
 if (isMenuOpen) {
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = '';
 }
 return () => {
 document.body.style.overflow = '';
 };
 }, [isMenuOpen]);

 return (
 <>
 <nav
 className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between page-padding transition-opacity duration-600"
 style={{
 backgroundColor: 'rgba(20, 20, 20, 0.8)',
 backdropFilter: 'blur(12px)',
 WebkitBackdropFilter: 'blur(12px)',
 borderBottom: '1px solid #1E1E1E',
 zIndex: 100,
 opacity: isVisible ? 1 : 0,
 transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
 }}
 >
 <button
 onClick={() => scrollTo('#hero')}
 className="font-mono text-xs uppercase tracking-[0.1em] text-[#F5F5F5] hover:opacity-80 transition-opacity"
 >
 Seth N. AKPLOGAN
 </button>

 {/* Desktop nav */}
 <div className="hidden md:flex items-center gap-8">
 {NAV_LINKS.map((link) => {
 const sectionId = link.href.replace('#', '');
 const isActive = activeSection === sectionId;
 return (
 <button
 key={link.href}
 onClick={() => scrollTo(link.href)}
 className="text-[13px] font-body tracking-[0.06em] transition-colors duration-200"
 style={{
 color: isActive ? '#F5F5F5' : '#CFCFCF',
 }}
 onMouseEnter={(e) => {
 if (!isActive) e.currentTarget.style.color = '#F5F5F5';
 }}
 onMouseLeave={(e) => {
 if (!isActive) e.currentTarget.style.color = '#CFCFCF';
 }}
 >
 {link.label}
 </button>
 );
 })}
 </div>

 {/* Mobile hamburger */}
 <button
 className="md:hidden flex flex-col gap-[5px] p-2"
 onClick={() => setIsMenuOpen(!isMenuOpen)}
 aria-label="Toggle menu"
 >
 <span
 className="block w-5 h-[2px] transition-all duration-300"
 style={{
 backgroundColor: '#CFCFCF',
 transform: isMenuOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none',
 }}
 />
 <span
 className="block w-5 h-[2px] transition-all duration-300"
 style={{
 backgroundColor: '#CFCFCF',
 opacity: isMenuOpen ? 0 : 1,
 }}
 />
 <span
 className="block w-5 h-[2px] transition-all duration-300"
 style={{
 backgroundColor: '#CFCFCF',
 transform: isMenuOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none',
 }}
 />
 </button>
 </nav>

 {/* Mobile overlay */}
 {isMenuOpen && (
 <div
 className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center gap-8 md:hidden"
 style={{ zIndex: 99, animation: 'fadeIn 0.3s ease forwards' }}
 >
 {NAV_LINKS.map((link, i) => (
 <button
 key={link.href}
 onClick={() => scrollTo(link.href)}
 className="font-display text-4xl text-[#F5F5F5] hover:text-[#B5423F] transition-colors"
 style={{
 animation: `fadeInUp 0.4s ease ${i * 0.08}s forwards`,
 opacity: 0,
 }}
 >
 {link.label}
 </button>
 ))}
 <style>{`
 @keyframes fadeIn {
 from { opacity: 0; }
 to { opacity: 1; }
 }
 @keyframes fadeInUp {
 from { opacity: 0; transform: translateY(20px); }
 to { opacity: 1; transform: translateY(0); }
 }
 `}</style>
 </div>
 )}
 </>
 );
}
