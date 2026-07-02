import type { Certification } from '@/types';

interface CertificationRowProps {
 cert: Certification;
}

export default function CertificationRow({ cert }: CertificationRowProps) {
 const isCompleted = cert.status === 'completed';
 const hasImage = !!cert.imageUrl;

 return (
 <div
 className="flex flex-col sm:flex-row sm:items-center py-6 border-b border-graphite transition-colors duration-200 hover:bg-white/[0.02] gap-4"
 data-cursor-hover
 >
  {/* Logo container */}
  <div className="shrink-0">
    {hasImage ? (
      <div className="w-12 h-12 rounded-lg overflow-hidden border border-graphite flex items-center justify-center bg-[#0A0A0A]">
        <img src={cert.imageUrl} alt={cert.platform} className="w-full h-full object-contain" />
      </div>
    ) : (
      <div className="w-12 h-12 rounded-lg border border-graphite bg-gradient-to-br from-[#1e1e1e] to-[#0a0a0a] flex items-center justify-center font-mono text-sm text-[#2F8F8F] font-bold">
        {cert.platform.substring(0, 2).toUpperCase()}
      </div>
    )}
  </div>

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
 className="text-[13px] text-[#B5423F] hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1 mt-2 sm:mt-0 shrink-0 self-start sm:self-center"
 >
 Verify <span>→</span>
 </a>
 )}
 </div>
 );
}
