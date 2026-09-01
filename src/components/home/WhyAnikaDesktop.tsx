"use client";

import Image from "next/image";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { whyReasons } from "@/data/home";
import { useStickyIndex } from "@/lib/useStickyIndex";
import { cn } from "@/lib/utils";

export default function WhyAnikaDesktop() {
  const ref = useRef<HTMLDivElement>(null);
  const count = whyReasons.length;
  const { active } = useStickyIndex(ref, count);
  const current = whyReasons[active];

  return (
    <section ref={ref} style={{ height: `${count * 90}vh` }} className="relative bg-navy-deeper">
      <div className="sticky top-0 flex h-[100svh] w-full flex-row">
        <div className="relative h-full w-1/2">
          <AnimatePresence mode="sync">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={current.image}
                alt={current.title}
                fill
                sizes="50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-deeper/80 via-navy-deeper/10 to-navy-deeper/30" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex w-1/2 flex-1 flex-col justify-center px-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
            Why ANIKA
          </p>
          <ul className="mt-6 flex flex-col">
            {whyReasons.map((reason, i) => {
              const isActive = i === active;
              return (
                <li
                  key={reason.id}
                  className={cn(
                    "border-b border-white/10 py-4 transition-all duration-500",
                    isActive ? "opacity-100" : "opacity-40"
                  )}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className={cn(
                        "font-display text-sm tracking-widest",
                        isActive ? "brand-gradient-text" : "text-white/40"
                      )}
                    >
                      {reason.index}
                    </span>
                    <h3 className="font-display text-[22px] font-medium leading-snug text-white">
                      {reason.title}
                    </h3>
                  </div>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="ml-9 mt-2 max-w-md overflow-hidden text-sm leading-relaxed text-white/55"
                      >
                        {reason.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
