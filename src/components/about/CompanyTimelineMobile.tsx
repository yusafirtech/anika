import Image from "next/image";
import { timelineStages as defaultTimelineStages } from "@/data/about";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/cms";

type TimelineStage = { id: string; label: string; title: string; description: string; image: string };

export default function CompanyTimelineMobile({
  timeline: timelineStages = defaultTimelineStages,
}: {
  timeline?: TimelineStage[];
}) {
  return (
    <div className="relative mt-10 px-5">
      <div className="relative flex flex-col gap-10">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/15" />
        {timelineStages.map((s, i) => (
          <Reveal key={s.id} y={16} className="relative pl-8">
            <span
              className={cn(
                "absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-navy-deeper",
                "bg-teal-light"
              )}
            />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-white/40">
              {String(i + 1).padStart(2, "0")} &middot; {s.label}
            </span>
            <h3 className="mt-2 font-display text-[20px] font-medium leading-tight text-white">
              {s.title}
            </h3>
            <div className="relative mt-3 h-[26vh] w-full overflow-hidden rounded-2xl">
              <Image
                src={resolveImageUrl(s.image)}
                alt={s.title}
                fill
                sizes="100vw"
                loading={i === 0 ? "eager" : "lazy"}
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-white/60">{s.description}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
