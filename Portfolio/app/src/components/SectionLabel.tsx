interface SectionLabelProps {
  text: string;
}

export default function SectionLabel({ text }: SectionLabelProps) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373] mb-6">
      {text}
    </p>
  );
}
