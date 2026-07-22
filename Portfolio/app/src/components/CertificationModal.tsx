import { useEffect } from 'react';
import type { Certification } from '@/types';
import { X, ExternalLink, Award, Calendar, CheckCircle2 } from 'lucide-react';

interface CertificationModalProps {
  cert: Certification | null;
  onClose: () => void;
}

export default function CertificationModal({ cert, onClose }: CertificationModalProps) {
  useEffect(() => {
    if (!cert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cert, onClose]);

  if (!cert) return null;

  const isCompleted = cert.status === 'completed';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden text-[#F5F5F5] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#222] rounded-full transition-colors"
          aria-label="Fermer la modale"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[#1E1E1E] rounded-xl border border-[#2E2E2E]">
            <Award className="w-6 h-6 text-[#2F8F8F]" />
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-[#A3A3A3]">
              {cert.platform}
            </span>
            <h2 className="font-body text-2xl font-bold leading-tight text-[#F5F5F5]">
              {cert.title}
            </h2>
          </div>
        </div>

        {/* Certificate Image Preview if available */}
        {cert.imageUrl && (
          <div className="my-5 w-full h-56 rounded-xl overflow-hidden border border-[#2A2A2A] bg-[#0A0A0A] flex items-center justify-center">
            <img
              src={cert.imageUrl}
              alt={cert.title}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#1E1E1E] my-4 text-sm font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2
              className="w-4 h-4 shrink-0"
              style={{ color: isCompleted ? '#2F8F8F' : '#B5423F' }}
            />
            <div>
              <p className="text-[10px] text-[#A3A3A3] uppercase">Statut</p>
              <p style={{ color: isCompleted ? '#2F8F8F' : '#B5423F' }}>
                {isCompleted ? 'Complété' : 'En cours'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#A3A3A3] shrink-0" />
            <div>
              <p className="text-[10px] text-[#A3A3A3] uppercase">Date d'obtention</p>
              <p className="text-[#CFCFCF]">{cert.dateEarned || 'Non spécifiée'}</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {cert.verifyUrl ? (
            <a
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B5423F] text-[#F5F5F5] font-body text-xs uppercase font-medium tracking-[0.06em] hover:bg-[#C94F4B] transition-colors rounded-lg"
            >
              Vérifier l'attestation officielle
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <button
              disabled
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1E1E1E] text-[#A3A3A3] font-body text-xs uppercase font-medium tracking-[0.06em] rounded-lg cursor-not-allowed"
            >
              Lien de vérification non fourni
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 bg-transparent border border-[#2A2A2A] text-[#CFCFCF] font-body text-xs uppercase tracking-[0.06em] hover:border-[#737373] hover:text-[#F5F5F5] transition-colors rounded-lg"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
