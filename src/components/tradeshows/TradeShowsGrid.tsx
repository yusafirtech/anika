import Image from "next/image";
import { resolveImageUrl } from "@/lib/cms";
import type { TradeShowItem } from "@/types/cms";
import type { Dictionary } from "@/i18n/dictionaries";

function formatRange(start: string, end?: string) {
  const startDate = new Date(start);
  const opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
  if (!end || end === start) return startDate.toLocaleDateString(undefined, opts);
  const endDate = new Date(end);
  return `${startDate.toLocaleDateString(undefined, opts)} – ${endDate.toLocaleDateString(undefined, opts)}`;
}

function EventCard({ event, dict, past = false }: { event: TradeShowItem; dict: Dictionary["tradeShows"]; past?: boolean }) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border bg-white transition-shadow ${
        past ? "border-black/[0.06] opacity-70" : "border-black/[0.08] hover:shadow-lg hover:shadow-navy-deeper/10"
      }`}
    >
      {event.image && (
        <div className="relative h-40 w-full overflow-hidden bg-mist">
          <Image src={resolveImageUrl(event.image)} alt={event.eventName} fill sizes="400px" className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-teal">
          {formatRange(event.startDate, event.endDate)}
        </span>
        <h3 className="mt-2 font-display text-lg font-medium text-navy-deeper">{event.eventName}</h3>
        <p className="mt-1 text-sm text-ink/60">{event.location}</p>
        {event.boothNumber && (
          <p className="mt-1 text-sm text-ink/60">
            {dict.booth}: <span className="font-semibold text-ink/80">{event.boothNumber}</span>
          </p>
        )}
        {event.description && <p className="mt-3 text-sm leading-relaxed text-ink/60">{event.description}</p>}
        {event.website && (
          <a
            href={event.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:underline"
          >
            {dict.visitWebsite} <span aria-hidden>&rarr;</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function TradeShowsGrid({
  events,
  dict,
  now,
}: {
  events: TradeShowItem[];
  dict: Dictionary["tradeShows"];
  now: number;
}) {
  const upcoming = events
    .filter((e) => new Date(e.endDate || e.startDate).getTime() >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const past = events
    .filter((e) => new Date(e.endDate || e.startDate).getTime() < now)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 md:px-8">
      <section>
        <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
          {dict.upcoming}
        </h2>
        {upcoming.length === 0 ? (
          <p className="mt-5 text-sm text-ink/50">{dict.noEvents}</p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} dict={dict} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-16 border-t border-black/[0.08] pt-12">
          <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
            {dict.past}
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <EventCard key={e.id} event={e} dict={dict} past />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
