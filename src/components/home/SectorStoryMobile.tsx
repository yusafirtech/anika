import Image from "next/image";
import { sectorStories as defaultSectorStories, type SectorStory } from "@/data/home";
import Reveal from "@/components/ui/Reveal";
import { resolveImageUrl } from "@/lib/cms";

export default function SectorStoryMobile({
  sectorStories = defaultSectorStories,
}: {
  sectorStories?: SectorStory[];
}) {
  return (
    <section className="bg-navy-deeper px-5 py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
        The Sectors We Move Through
      </p>

      <div className="mt-8 flex flex-col gap-12">
        {sectorStories.map((s, i) => (
          <Reveal key={s.id} y={20}>
            <span className="text-[11px] font-medium tracking-[0.2em] text-white/40">
              {s.eyebrow}
            </span>
            <h3 className="mt-3 font-display text-[24px] font-medium leading-[1.15] text-white">
              {s.title}
            </h3>
            <div className="relative mt-4 h-[42vh] w-full overflow-hidden rounded-2xl">
              <Image
                src={resolveImageUrl(s.image)}
                alt={s.title}
                fill
                sizes="100vw"
                loading={i === 0 ? "eager" : "lazy"}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper/50 via-transparent to-transparent" />
              <span className="absolute bottom-3 right-3 rounded-full bg-navy-deeper/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                {String(i + 1).padStart(2, "0")}/{String(sectorStories.length).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-white/60">{s.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
