"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { whyReasons as defaultWhyReasons, type WhyReason } from "@/data/home";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/cms";

const SLIDE_DURATION = 4500; // 4.5 seconds per reason

export default function WhyAnikaDesktop({
  whyReasons = defaultWhyReasons,
}: {
  whyReasons?: WhyReason[];
}) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = whyReasons.length;

  const goToSlide = useCallback((index: number) => {
    setActive(index);
  }, []);

  const nextSlide = useCallback(() => {
    setActive((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
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
      aria-label="Why Choose ANIKA"
    >
      <div className="flex h-full w-full flex-row">
        {/* Left: Image */}
        <div className="relative h-full w-1/2 overflow-hidden">
          <AnimatePresence mode="sync">
            {whyReasons.map(
              (reason, i) =>
                i === active && (
                  <motion.div
                    key={reason.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={resolveImageUrl(reason.image)}
                      alt={reason.title}
                      fill
                      sizes="50vw"
                      priority={i === 0}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy-deeper/80 via-navy-deeper/20 to-navy-deeper/40" />
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>

        {/* Right: Reasons list & controls */}
        <div className="flex w-1/2 flex-1 flex-col justify-between px-12 py-12 lg:px-16">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
                Why ANIKA
              </p>
              {isPaused && (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] tracking-wider text-white/60">
                  PAUSED
                </span>
              )}
            </div>

            <ul className="mt-6 flex flex-col">
              {whyReasons.map((reason, i) => {
                const isActive = i === active;
                return (
                  <li
                    key={reason.id}
                    className={cn(
                      "group relative border-b border-white/10 py-3.5 transition-all duration-300",
                      isActive ? "opacity-100" : "opacity-40 hover:opacity-75"
                    )}
                  >
                    <button
                      onClick={() => goToSlide(i)}
                      className="w-full text-left"
                      aria-label={`Select ${reason.title}`}
                    >
                      <div className="flex items-baseline gap-4">
                        <span
                          className={cn(
                            "font-display text-sm tracking-widest",
                            isActive ? "brand-gradient-text font-bold" : "text-white/40"
                          )}
                        >
                          {reason.index}
                        </span>
                        <h3 className="font-display text-[20px] font-medium leading-snug text-white lg:text-[22px]">
                          {reason.title}
                        </h3>
                      </div>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="ml-9 mt-2 max-w-md overflow-hidden text-[14px] leading-relaxed text-white/65"
                          >
                            {reason.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </button>

                    {/* Progress indicator line for active item */}
                    {isActive && (
                      <motion.span
                        key={`why-progress-${active}-${isPaused}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: isPaused ? 0 : SLIDE_DURATION / 1000,
                          ease: "linear",
                        }}
                        style={{ originX: 0 }}
                        className="absolute bottom-0 left-0 right-0 h-[2px] brand-gradient-bg"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bottom controls */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-[12px] font-medium tracking-[0.2em] text-white/45">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Previous reason"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Next reason"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
