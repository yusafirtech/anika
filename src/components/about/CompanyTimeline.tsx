"use client";

import Image from "next/image";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { timelineStages } from "@/data/about";
import { useStickyIndex } from "@/lib/useStickyIndex";
import { useIsDesktop } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export default function CompanyTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const count = timelineStages.length;
  const { active, progress } = useStickyIndex(ref, count);
  const isDesktop = useIsDesktop();
  const vhPerItem = isDesktop ? 85 : 58;
  const current = timelineStages[active];

  return (
    <section className="bg-navy-deeper">
      <div className="mx-auto max-w-6xl px-6 pt-20 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
          Company Story
        </p>
        <h2 className="mt-4 max-w-xl font-display text-[30px] font-medium leading-tight text-white md:text-[40px]">
          From One Capability to a Connected Business
        </h2>
      </div>

      <div ref={ref} style={{ height: `${count * vhPerItem}vh` }} className="relative mt-6">
        <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center px-6 md:flex-row md:px-8">
          {/* Timeline rail */}
          <div className="relative flex w-full shrink-0 flex-row gap-4 overflow-x-auto pb-6 md:w-[300px] md:flex-col md:gap-0 md:overflow-visible md:pb-0">
            <div className="absolute left-0 top-2 h-[3px] w-full bg-white/10 md:left-2 md:top-0 md:h-full md:w-[3px]">
              <motion.div
                style={{ scaleX: isDesktop ? 1 : progress, scaleY: isDesktop ? progress : 1 }}
                className="h-full w-full origin-left brand-gradient-bg md:origin-top"
              />
            </div>
            {timelineStages.map((s, i) => (
              <div
                key={s.id}
                className={cn(
                  "relative shrink-0 pl-0 pt-6 pr-6 md:pl-8 md:pt-0 md:py-5",
                  "min-w-[110px] md:min-w-0"
                )}
              >
                <span
                  className={cn(
                    "absolute -top-0.5 left-0 h-2 w-2 -translate-x-1/2 rounded-full md:left-2 md:top-1/2 md:-translate-y-1/2",
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
          <div className="mt-8 grid w-full flex-1 grid-cols-1 items-center gap-8 md:mt-0 md:grid-cols-2 md:gap-10 md:pl-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="font-display text-[24px] font-medium leading-tight text-white md:text-[30px]">
                  {current.title}
                </h3>
                <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/60 md:text-[15px]">
                  {current.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="relative h-[38vh] w-full overflow-hidden rounded-2xl md:h-[48vh]">
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
                    src={current.image}
                    alt={current.title}
                    fill
                    sizes="(min-width: 768px) 40vw, 90vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
