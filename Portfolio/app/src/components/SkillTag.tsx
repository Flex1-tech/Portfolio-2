interface SkillTagProps {
 skill: string;
}

export default function SkillTag({ skill }: SkillTagProps) {
 return (
 <span
 className="inline-block font-mono text-xs tracking-[0.04em] text-[#B5423F] px-4 py-2 border transition-all duration-200 cursor-default"
 style={{
 backgroundColor: 'rgba(181, 66, 63, 0.15)',
 borderColor: 'rgba(181, 66, 63, 0.25)',
 }}
 onMouseEnter={(e) => {
 e.currentTarget.style.backgroundColor = '#B5423F';
 e.currentTarget.style.color = '#F5F5F5';
 }}
 onMouseLeave={(e) => {
 e.currentTarget.style.backgroundColor = 'rgba(181, 66, 63, 0.15)';
 e.currentTarget.style.color = '#B5423F';
 }}
 >
 {skill}
 </span>
 );
}
