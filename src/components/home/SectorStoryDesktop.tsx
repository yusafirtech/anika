"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sectorStories as defaultSectorStories, type SectorStory } from "@/data/home";
import { resolveImageUrl } from "@/lib/cms";

const SLIDE_DURATION = 5000; // 5 seconds per slide

export default function SectorStoryDesktop({
  sectorStories = defaultSectorStories,
}: {
  sectorStories?: SectorStory[];
}) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const count = sectorStories.length;
  const current = sectorStories[active];

  const goToSlide = useCallback((index: number) => {
    setDirection(index >= active ? 1 : -1);
    setActive(index);
  }, [active]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setActive((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, active]);

  return (
    <section
      className="relative h-[88vh] min-h-[640px] max-h-[860px] w-full overflow-hidden bg-navy-deeper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Sector stories carousel"
    >
      <div className="flex h-full w-full flex-row">
        {/* Left: Text & Controls */}
        <div className="relative z-10 flex w-[45%] flex-col justify-between px-12 py-14 lg:px-16">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
                The Sectors We Move Through
              </p>
              {isPaused && (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] tracking-wider text-white/60">
                  PAUSED
                </span>
              )}
            </div>

            <div className="mt-12 min-h-[260px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: direction * 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -direction * 16 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="text-[12px] font-medium tracking-[0.2em] text-white/40">
                    {current.eyebrow}
                  </span>
                  <h3 className="mt-4 font-display text-[36px] font-medium leading-[1.12] text-white lg:text-[42px]">
                    {current.title}
                  </h3>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65">
                    {current.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom navigation & progress */}
          <div className="space-y-6">
            {/* Progress pills */}
            <div className="flex items-center gap-2">
              {sectorStories.map((s, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={s.id}
                    onClick={() => goToSlide(i)}
                    className="group relative h-2 flex-1 overflow-hidden rounded-full bg-white/15 transition-all hover:bg-white/25"
                    aria-label={`Go to slide ${i + 1}: ${s.title}`}
                  >
                    {isActive && (
                      <motion.span
                        key={`progress-${active}-${isPaused}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: isPaused ? 0 : SLIDE_DURATION / 1000,
                          ease: "linear",
                        }}
                        style={{ originX: 0 }}
                        className="absolute inset-0 brand-gradient-bg"
                      />
                    )}
                    {i < active && <span className="absolute inset-0 brand-gradient-bg" />}
                  </button>
                );
              })}
            </div>

            {/* Controls and counter */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium tracking-[0.2em] text-white/45">
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white"
                  aria-label="Previous slide"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white"
                  aria-label="Next slide"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Image */}
        <div className="relative w-[55%] flex-1 overflow-hidden">
          <AnimatePresence mode="sync">
            {sectorStories.map(
              (s, i) =>
                i === active && (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={resolveImageUrl(s.image)}
                      alt={s.title}
                      fill
                      sizes="55vw"
                      priority={i === 0}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy-deeper/70 via-navy-deeper/20 to-transparent" />
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
