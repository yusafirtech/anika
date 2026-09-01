"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { businessShowcase } from "@/data/home";
import { useStickyIndex } from "@/lib/useStickyIndex";

export default function BusinessShowcaseDesktop() {
  const ref = useRef<HTMLDivElement>(null);
  const count = businessShowcase.length;
  const { active } = useStickyIndex(ref, count);
  const current = businessShowcase[active];

  return (
    <section ref={ref} style={{ height: `${count * 100}vh` }} className="relative bg-paper">
      <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-8 py-24">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
            What We Do
          </p>
          <h2 className="mt-3 font-display text-[44px] font-medium leading-tight text-navy-deeper">
            A Connected Business Ecosystem
          </h2>
        </div>

        <div className="relative mx-auto grid w-full max-w-6xl flex-1 grid-cols-[1.1fr_0.9fr] items-center gap-8">
          {/* Image panel */}
          <div className="relative order-2 h-[62vh] w-full overflow-hidden rounded-2xl">
            <AnimatePresence mode="sync">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  sizes="45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-navy-deeper/10" />
              </motion.div>
            </AnimatePresence>
            <span className="absolute right-4 top-4 rounded-full bg-navy-deeper/70 px-3 py-1 text-[11px] font-medium tracking-widest text-white backdrop-blur-sm">
              {current.index} / {String(count).padStart(2, "0")}
            </span>
          </div>

          {/* Text panel */}
          <div className="order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="brand-gradient-text font-display text-sm font-semibold tracking-[0.2em]">
                  BUSINESS {current.index}
                </span>
                <h3 className="mt-3 font-display text-[32px] font-medium leading-tight text-navy-deeper">
                  {current.title}
                </h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/60">
                  {current.description}
                </p>
                <ul className="mt-5 flex flex-col gap-2">
                  {current.points.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-sm text-ink/70">
                      <span className="h-1 w-1 rounded-full bg-teal" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={current.href}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-navy transition-all hover:gap-3"
                >
                  {current.cta}
                  <span aria-hidden>&rarr;</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dot indicator */}
        <div className="mt-8 flex items-center justify-center gap-2.5">
          {businessShowcase.map((b, i) => (
            <span
              key={b.id}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-7 brand-gradient-bg" : "w-1.5 bg-navy/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
