import Image from "next/image";
import { timelineStages as defaultTimelineStages } from "@/data/about";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/cms";

type TimelineStage = { id: string; label: string; title: string; description: string; image: string };

export default function CompanyTimelineDesktop({
  timeline: timelineStages = defaultTimelineStages,
}: {
  timeline?: TimelineStage[];
}) {
  return (
    <div className="mx-auto max-w-6xl px-8 pb-24 pt-14">
      <ol className="relative">
        <span aria-hidden className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-white/10" />
        {timelineStages.map((s, i) => (
          <li key={s.id} className="relative grid grid-cols-[24px_1fr] gap-8 pb-14 last:pb-0">
            <span className="relative z-10 mt-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-navy-deeper bg-teal-light" />
            <div
              className={cn(
                "grid grid-cols-2 items-center gap-12",
                i % 2 === 1 && "[&>*:first-child]:order-2"
              )}
            >
              <div>
                <span className="text-[11px] font-semibold tracking-[0.2em] text-teal-light">
                  {String(i + 1).padStart(2, "0")} &middot; {s.label}
                </span>
                <h3 className="mt-3 font-display text-[28px] font-medium leading-tight text-white">{s.title}</h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">{s.description}</p>
              </div>
              <div className="relative h-[300px] w-full overflow-hidden rounded-2xl">
                <Image
                  src={resolveImageUrl(s.image)}
                  alt={s.title}
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
