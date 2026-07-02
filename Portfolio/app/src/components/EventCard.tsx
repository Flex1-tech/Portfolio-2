import type { Event } from '@/types';

interface EventCardProps {
 event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const hasImage = !!event.imageUrl;

  return (
    <div
      className="bg-obsidian border border-graphite p-8 transition-all duration-300 hover:border-[#737373] hover:-translate-y-1 flex flex-col sm:flex-row gap-6 items-start sm:items-stretch"
      data-cursor-hover
    >
      {hasImage && (
        <div className="w-full sm:w-[140px] h-[140px] overflow-hidden rounded-lg shrink-0">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-body text-lg font-medium text-[#F5F5F5]">{event.title}</h3>
          <p className="text-[13px] text-[#737373] mt-1">{event.organization}</p>
          <span
            className="inline-block font-mono text-[11px] uppercase tracking-[0.04em] text-[#B5423F] px-3 py-1.5 mt-3"
            style={{ backgroundColor: 'rgba(181, 66, 63, 0.15)' }}
          >
            {event.role}
          </span>
          <p className="text-sm text-[#CFCFCF] mt-4 leading-relaxed line-clamp-3">
            {event.description}
          </p>
        </div>
        <p className="font-mono text-[11px] text-graphite mt-4">{event.year}</p>
      </div>
    </div>
  );
}
