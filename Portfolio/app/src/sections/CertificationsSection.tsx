import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/SectionLabel";
import SectionHeading from "@/components/SectionHeading";
import CertificationRow from "@/components/CertificationRow";
import { getCertifications } from "@/services/api";
import type { Certification } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function CertificationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const data = await getCertifications();
        // Transform backend data to frontend format
        const transformedCerts: Certification[] = data.map((cert) => ({
          platform: cert.platform,
          title: cert.title,
          status: cert.status as "completed" | "in-progress",
          verifyUrl: cert.credential_url,
        }));
        setCertifications(transformedCerts);
      } catch (error) {
        console.error("Failed to fetch certifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const rows = list.querySelectorAll(".cert-row");
    gsap.set(rows, { opacity: 0, x: -30 });

    const animation = gsap.to(rows, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: list,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="bg-obsidian border-t border-graphite"
    >
      <div
        className="section-gap page-padding"
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        <SectionLabel text="04 — CERTIFICATIONS" />
        <SectionHeading text="Credentials &\nLearning" className="mb-12" />

        <div ref={listRef}>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Loading certifications...</p>
            </div>
          ) : certifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No certifications available</p>
            </div>
          ) : (
            certifications.map((cert) => (
              <div key={cert.platform + cert.title} className="cert-row">
                <CertificationRow cert={cert} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
