interface SectionLabelProps {
 text: string;
}

export default function SectionLabel({ text }: SectionLabelProps) {
 return (
 <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#A3A3A3] mb-6">
 {text}
 </p>
 );
}
