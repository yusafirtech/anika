"use client";

import Image from "next/image";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { timelineStages as defaultTimelineStages } from "@/data/about";
import { useStickyIndex } from "@/lib/useStickyIndex";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/cms";

type TimelineStage = { id: string; label: string; title: string; description: string; image: string };

export default function CompanyTimelineDesktop({
  timeline: timelineStages = defaultTimelineStages,
}: {
  timeline?: TimelineStage[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const count = timelineStages.length;
  const { active, progress } = useStickyIndex(ref, count);
  const current = timelineStages[active];

  return (
    <div ref={ref} style={{ height: `${count * 85}vh` }} className="relative mt-6">
      <div className="sticky top-0 flex h-[100svh] w-full flex-row px-8">
        {/* Timeline rail */}
        <div className="relative flex w-[300px] shrink-0 flex-col gap-0">
          <div className="absolute left-2 top-0 h-full w-[3px] bg-white/10">
            <motion.div
              style={{ scaleY: progress }}
              className="h-full w-full origin-top brand-gradient-bg"
            />
          </div>
          {timelineStages.map((s, i) => (
            <div key={s.id} className="relative shrink-0 py-5 pl-8">
              <span
                className={cn(
                  "absolute left-2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                  i <= active ? "bg-teal-light" : "bg-white/20"
                )}
              />
              <span
                className={cn(
                  "text-[11px] font-semibold tracking-[0.2em] transition-colors",
                  i === active ? "text-white" : "text-white/35"
                )}
              >
                {String(i + 1).padStart(2, "0")} &middot; {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="grid w-full flex-1 grid-cols-2 items-center gap-10 pl-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="font-display text-[30px] font-medium leading-tight text-white">
                {current.title}
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
                {current.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="relative h-[48vh] w-full overflow-hidden rounded-2xl">
            <AnimatePresence mode="sync">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={resolveImageUrl(current.image)}
                  alt={current.title}
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
