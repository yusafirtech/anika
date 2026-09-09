"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { homeProjects } from "@/data/home";

const SLIDE_DURATION = 5000;

export default function ProjectStoryDesktop() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const total = homeProjects.length;
  const current = homeProjects[active];

  const goToSlide = useCallback((index: number) => {
    setDirection(index >= active ? 1 : -1);
    setActive(index);
  }, [active]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setActive((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, active]);

  return (
    <div
      className="relative mx-auto mt-10 max-w-6xl px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Projects showcase carousel"
    >
      {/* Project Card */}
      <div className="relative overflow-hidden rounded-3xl bg-navy-deeper shadow-2xl shadow-navy-deeper/25">
        <div className="grid grid-cols-2">
          {/* Content */}
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-12 lg:p-14">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
                  {current.category} &middot; {String(active + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
                </span>
                {isPaused && (
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] tracking-wider text-white/60">
                    PAUSED
                  </span>
                )}
              </div>

              <div className="mt-8">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: direction * 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -direction * 18 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="font-display text-[32px] font-medium leading-tight text-white lg:text-[38px]">
                      {current.name}
                    </h3>
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/65">
                      {current.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-[14px] text-white/60">
                      <div className="rounded-lg bg-white/5 px-4 py-2.5 backdrop-blur-sm border border-white/5">
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">
                          Location
                        </span>
                        <span className="font-medium text-white">{current.location}</span>
                      </div>
                      <div className="rounded-lg bg-white/5 px-4 py-2.5 backdrop-blur-sm border border-white/5">
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">
                          Status
                        </span>
                        <span className="font-medium text-teal-light">{current.status}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Controls and navigation */}
            <div className="mt-10 flex items-center justify-between pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                {homeProjects.map((p, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={p.id}
                      onClick={() => goToSlide(i)}
                      className={`h-2 rounded-full transition-all ${
                        isActive ? "w-8 brand-gradient-bg" : "w-2 bg-white/20 hover:bg-white/40"
                      }`}
                      aria-label={`Go to project ${p.name}`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/75 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white"
                  aria-label="Previous project"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/75 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white"
                  aria-label="Next project"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative min-h-[460px] w-full overflow-hidden">
            <AnimatePresence mode="sync">
              {homeProjects.map(
                (project, i) =>
                  i === active && (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        sizes="50vw"
                        priority={i === 0}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-navy-deeper/70 via-navy-deeper/10 to-transparent" />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
