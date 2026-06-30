import type { Certification } from '@/types';

interface CertificationRowProps {
 cert: Certification;
}

export default function CertificationRow({ cert }: CertificationRowProps) {
 const isCompleted = cert.status === 'completed';

 return (
 <div
 className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 border-b border-graphite transition-colors duration-200 hover:bg-white/[0.02]"
 data-cursor-hover
 >
 <div className="flex-1">
 <div className="flex items-center gap-2">
 <h3 className="font-body text-base font-medium text-[#F5F5F5]">
 {cert.platform}
 </h3>
 <span
 className="inline-flex items-center gap-1.5"
 >
 <span
 className="w-1.5 h-1.5 rounded-full"
 style={{ backgroundColor: isCompleted ? '#2F8F8F' : '#B5423F' }}
 />
 <span
 className="font-mono text-[10px] uppercase tracking-[0.1em]"
 style={{ color: isCompleted ? '#2F8F8F' : '#B5423F' }}
 >
 {cert.status}
 </span>
 </span>
 </div>
 <p className="text-sm text-[#CFCFCF] mt-1">{cert.title}</p>
 </div>
 {cert.verifyUrl && (
 <a
 href={cert.verifyUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="text-[13px] text-[#B5423F] hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1 mt-2 sm:mt-0 shrink-0"
 >
 Verify <span>→</span>
 </a>
 )}
 </div>
 );
}
