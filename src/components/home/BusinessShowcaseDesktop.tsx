"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { businessShowcase as defaultBusinessShowcase, type BusinessShowcaseItem } from "@/data/home";
import { resolveImageUrl } from "@/lib/cms";

const SLIDE_DURATION = 5500; // 5.5s per slide

export default function BusinessShowcaseDesktop({
  businessShowcase = defaultBusinessShowcase,
}: {
  businessShowcase?: BusinessShowcaseItem[];
}) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const count = businessShowcase.length;
  const current = businessShowcase[active];

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
      className="relative bg-paper py-20 lg:py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Connected Business Ecosystem"
    >
      <div className="mx-auto max-w-6xl px-8">
        {/* Header with nav controls */}
        <div className="flex items-end justify-between border-b border-navy/10 pb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
              What We Do
            </p>
            <h2 className="mt-3 font-display text-[38px] font-medium leading-tight text-navy-deeper lg:text-[44px]">
              A Connected Business Ecosystem
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {isPaused && (
              <span className="rounded-full bg-navy/10 px-2.5 py-1 text-[10px] font-medium tracking-wider text-navy/60">
                PAUSED
              </span>
            )}
            <button
              onClick={prevSlide}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/20 text-navy transition-all hover:border-navy hover:bg-navy hover:text-white"
              aria-label="Previous business"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/20 text-navy transition-all hover:border-navy hover:bg-navy hover:text-white"
              aria-label="Next business"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick business pills tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {businessShowcase.map((b, i) => {
            const isActive = i === active;
            return (
              <button
                key={b.id}
                onClick={() => goToSlide(i)}
                className={`group relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-navy-deeper text-white shadow-md"
                    : "bg-navy/5 text-navy/70 hover:bg-navy/10 hover:text-navy"
                }`}
              >
                <span>
                  {b.index} &middot; {b.title}
                </span>
                {isActive && (
                  <motion.span
                    key={`bar-${active}-${isPaused}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: isPaused ? 0 : SLIDE_DURATION / 1000,
                      ease: "linear",
                    }}
                    style={{ originX: 0 }}
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] brand-gradient-bg"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content grid */}
        <div className="relative mt-12 grid grid-cols-[1.1fr_0.9fr] items-center gap-12">
          {/* Text panel */}
          <div className="order-1 min-h-[380px] flex flex-col justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: direction * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="brand-gradient-text font-display text-sm font-semibold tracking-[0.2em]">
                  BUSINESS {current.index}
                </span>
                <h3 className="mt-3 font-display text-[32px] font-medium leading-tight text-navy-deeper">
                  {current.title}
                </h3>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink/70">
                  {current.description}
                </p>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {current.points.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-sm text-ink/80 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href={current.href}
                    className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-navy-deeper hover:gap-3 shadow-md shadow-navy/10"
                  >
                    {current.cta}
                    <span aria-hidden>&rarr;</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Image panel */}
          <div className="relative order-2 h-[420px] w-full overflow-hidden rounded-2xl shadow-xl shadow-navy-deeper/10">
            <AnimatePresence mode="sync">
              {businessShowcase.map(
                (b, i) =>
                  i === active && (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={resolveImageUrl(b.image)}
                        alt={b.title}
                        fill
                        sizes="45vw"
                        priority={i === 0}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-navy-deeper/10" />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
            <span className="absolute right-4 top-4 rounded-full bg-navy-deeper/75 px-3 py-1 text-[11px] font-medium tracking-widest text-white backdrop-blur-md">
              {current.index} / {String(count).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
