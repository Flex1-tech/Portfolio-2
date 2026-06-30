import type { Event } from '@/types';

interface EventCardProps {
 event: Event;
}

export default function EventCard({ event }: EventCardProps) {
 return (
 <div
 className="bg-obsidian border border-graphite p-8 transition-all duration-300 hover:border-[#737373] hover:-translate-y-1"
 data-cursor-hover
 >
 <h3 className="font-body text-lg font-medium text-[#F5F5F5]">{event.title}</h3>
 <p className="text-[13px] text-[#737373] mt-1">{event.organization}</p>
 <span
 className="inline-block font-mono text-[11px] uppercase tracking-[0.04em] text-[#B5423F] px-3 py-1.5 mt-3"
 style={{ backgroundColor: 'rgba(181, 66, 63, 0.15)' }}
 >
 {event.role}
 </span>
 <p className="text-sm text-[#CFCFCF] mt-4 leading-relaxed line-clamp-2">
 {event.description}
 </p>
 <p className="font-mono text-[11px] text-graphite mt-4">{event.year}</p>
 </div>
 );
}
