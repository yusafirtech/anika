"use client";

import Image from "next/image";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sectorStories } from "@/data/home";
import { useStickyIndex } from "@/lib/useStickyIndex";
import { useIsDesktop } from "@/lib/hooks";

export default function SectorStory() {
  const ref = useRef<HTMLDivElement>(null);
  const count = sectorStories.length;
  const { active, progress } = useStickyIndex(ref, count);
  const isDesktop = useIsDesktop();
  const vhPerItem = isDesktop ? 100 : 65;
  const current = sectorStories[active];

  return (
    <section
      ref={ref}
      style={{ height: `${count * vhPerItem}vh` }}
      className="relative bg-navy-deeper"
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col overflow-hidden md:flex-row">
        {/* Left: text */}
        <div className="relative z-10 flex w-full flex-col justify-center px-6 pb-8 pt-24 md:w-[44%] md:px-14 md:pb-0 md:pt-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
            The Sectors We Move Through
          </p>
          <div className="mt-8 min-h-[220px] md:min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-[12px] font-medium tracking-[0.2em] text-white/40">
                  {current.eyebrow}
                </span>
                <h3 className="mt-4 font-display text-[28px] font-medium leading-[1.1] text-white sm:text-[34px] md:text-[38px] lg:text-[44px]">
                  {current.title}
                </h3>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/60">
                  {current.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress indicator */}
          <div className="mt-10 flex items-center gap-3">
            {sectorStories.map((s, i) => (
              <span
                key={s.id}
                className="relative h-[3px] flex-1 max-w-10 overflow-hidden rounded-full bg-white/15"
              >
                {i === active && (
                  <motion.span
                    className="absolute inset-y-0 left-0 brand-gradient-bg"
                    style={{
                      scaleX: progress,
                      originX: 0,
                    }}
                  />
                )}
                {i < active && <span className="absolute inset-0 brand-gradient-bg" />}
              </span>
            ))}
            <span className="ml-2 whitespace-nowrap text-[11px] tracking-[0.2em] text-white/40">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Right: image */}
        <div className="relative w-full flex-1 md:w-[56%]">
          <AnimatePresence mode="sync">
            {sectorStories.map(
              (s, i) =>
                i === active && (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(min-width: 768px) 56vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper/70 via-navy-deeper/10 to-transparent md:bg-gradient-to-r md:from-navy-deeper/60 md:via-transparent md:to-transparent" />
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
