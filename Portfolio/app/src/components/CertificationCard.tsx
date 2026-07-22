import type { Certification } from '@/types';
import { Award, ExternalLink } from 'lucide-react';
import { getCertificationLogo } from '@/lib/cloudinary';

interface CertificationCardProps {
  cert: Certification;
  onViewCert: (cert: Certification) => void;
}

/**
 * Returns brand badge background and text colors for common platforms if logo image is missing
 */
function getPlatformBadge(platform: string) {
  const name = platform.toLowerCase();
  if (name.includes('google')) return { bg: 'from-blue-600/20 to-green-600/20', color: '#4285F4', text: 'G' };
  if (name.includes('ibm')) return { bg: 'from-blue-700/20 to-indigo-700/20', color: '#054ADA', text: 'IBM' };
  if (name.includes('cisco')) return { bg: 'from-cyan-600/20 to-blue-600/20', color: '#00BCEB', text: 'CISCO' };
  if (name.includes('coursera')) return { bg: 'from-blue-500/20 to-blue-700/20', color: '#0056D2', text: 'C' };
  if (name.includes('deeplearning') || name.includes('deep learning'))
    return { bg: 'from-red-600/20 to-orange-600/20', color: '#FF4154', text: 'DL' };
  if (name.includes('microsoft')) return { bg: 'from-blue-500/20 to-yellow-500/20', color: '#00A4EF', text: 'MS' };
  if (name.includes('aws') || name.includes('amazon'))
    return { bg: 'from-amber-600/20 to-orange-600/20', color: '#FF9900', text: 'AWS' };
  if (name.includes('kaggle')) return { bg: 'from-sky-500/20 to-blue-600/20', color: '#20BEFF', text: 'K' };

  return { bg: 'from-[#1E1E1E] to-[#0A0A0A]', color: '#2F8F8F', text: platform.substring(0, 2).toUpperCase() };
}

export default function CertificationCard({ cert, onViewCert }: CertificationCardProps) {
  const isCompleted = cert.status === 'completed';
  const hasImage = !!cert.imageUrl;
  const badge = getPlatformBadge(cert.platform);

  return (
    <div
      className="group relative flex flex-col justify-between p-6 bg-[#121212] border border-[#1E1E1E] rounded-xl hover:border-[#3A3A3A] hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl"
      data-cursor-hover
    >
      {/* Top Header: Badge + Status */}
      <div>
        <div className="flex items-center justify-between mb-5">
          {/* Logo / Badge */}
          {hasImage ? (
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#2A2A2A] bg-[#0A0A0A] p-2 flex items-center justify-center shrink-0">
            <img src={getCertificationLogo(cert.imageUrl)} alt={cert.platform} className="w-full h-full object-contain" loading="lazy" decoding="async" />
            </div>
          ) : (
            <div
              className={`w-12 h-12 rounded-lg border border-[#2A2A2A] bg-gradient-to-br ${badge.bg} flex items-center justify-center font-mono text-xs font-bold shrink-0`}
              style={{ color: badge.color }}
            >
              {badge.text}
            </div>
          )}

          {/* Status Badge */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.1em]"
            style={{
              color: isCompleted ? '#2F8F8F' : '#B5423F',
              backgroundColor: isCompleted ? 'rgba(47, 143, 143, 0.12)' : 'rgba(181, 66, 63, 0.15)',
              border: `1px solid ${isCompleted ? 'rgba(47, 143, 143, 0.25)' : 'rgba(181, 66, 63, 0.25)'}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: isCompleted ? '#2F8F8F' : '#B5423F' }}
            />
            {isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
          </span>
        </div>

        {/* Platform Name */}
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#A3A3A3] mb-1">
          {cert.platform}
        </p>

        {/* Title */}
        <h3 className="font-body text-lg font-semibold text-[#F5F5F5] group-hover:text-[#FFFFFF] transition-colors leading-snug mb-3">
          {cert.title}
        </h3>
      </div>

      {/* Footer: Date + Action */}
      <div className="pt-4 mt-4 border-t border-[#1A1A1A] flex items-center justify-between">
        {cert.dateEarned ? (
          <span className="font-mono text-xs text-[#A3A3A3] flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#2F8F8F]" />
            {cert.dateEarned}
          </span>
        ) : (
          <span className="font-mono text-xs text-[#A3A3A3]">Verified Credential</span>
        )}

        <button
          onClick={() => onViewCert(cert)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B5423F] hover:text-[#C94F4B] transition-colors"
          aria-label={`Voir le certificat ${cert.title}`}
        >
          Voir le certificat
          <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}
