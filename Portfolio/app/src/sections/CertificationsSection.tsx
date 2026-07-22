import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/SectionLabel";
import SectionHeading from "@/components/SectionHeading";
import CertificationCard from "@/components/CertificationCard";
import CertificationModal from "@/components/CertificationModal";
import { getCertifications } from "@/services/api";
import { formatCertDate } from "@/lib/utils";
import type { Certification } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function CertificationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const { data: certifications = [], isLoading: loading } = useQuery({
    queryKey: ["certifications"],
    queryFn: async () => {
      const data = await getCertifications();
      const sortedData = [...data].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
      return sortedData.map((cert): Certification => ({
        platform: cert.platform,
        title: cert.title,
        status: cert.status === "in_progress" ? "in-progress" : "completed",
        verifyUrl: cert.credential_url,
        imageUrl: cert.image_url || undefined,
        dateEarned: formatCertDate(cert.date_earned),
      }));
    },
  });

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || loading || certifications.length === 0) return;

    const cards = grid.querySelectorAll(".cert-card");
    gsap.set(cards, { opacity: 0, y: 30 });

    const animation = gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: grid,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      animation.kill();
    };
  }, [loading, certifications]);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="bg-obsidian border-t border-graphite py-20"
    >
      <div
        className="page-padding"
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        <SectionLabel text="04 — CERTIFICATIONS" />
        <SectionHeading text="Credentials & Learning" className="mb-12" />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#A3A3A3]">Loading certifications...</p>
          </div>
        ) : certifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#A3A3A3]">No certifications available</p>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certifications.map((cert) => (
              <div key={cert.platform + cert.title} className="cert-card">
                <CertificationCard
                  cert={cert}
                  onViewCert={(c) => setSelectedCert(c)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Certification Modal */}
      <CertificationModal
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </section>
  );
}
