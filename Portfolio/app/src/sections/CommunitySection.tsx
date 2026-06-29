import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/SectionLabel";
import SectionHeading from "@/components/SectionHeading";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/services/api";
import type { Event } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function CommunitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        // Transform backend data to frontend format
        const transformedEvents: Event[] = data.map((event) => ({
          title: event.title,
          organization: event.organization,
          role: event.role,
          description: event.description,
          year: event.year,
        }));
        setEvents(transformedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll(".event-card");
    gsap.set(cards, { opacity: 0, y: 40 });

    const animation = gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "cubic-bezier(0.19, 1, 0.22, 1)",
      scrollTrigger: {
        trigger: grid,
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
      id="community"
      ref={sectionRef}
      className="section-gap page-padding"
      style={{ maxWidth: "1280px", margin: "0 auto" }}
    >
      <SectionLabel text="05 — COMMUNITY" />
      <SectionHeading text="Engagement &\nMentoring" className="mb-12" />

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="text-center py-12 col-span-full">
            <p className="text-gray-400">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 col-span-full">
            <p className="text-gray-400">No events available</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.title} className="event-card">
              <EventCard event={event} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
