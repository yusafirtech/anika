"use client";

import Image from "next/image";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { whyReasons } from "@/data/home";
import { useStickyIndex } from "@/lib/useStickyIndex";
import { useIsDesktop } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export default function WhyAnika() {
  const ref = useRef<HTMLDivElement>(null);
  const count = whyReasons.length;
  const { active } = useStickyIndex(ref, count);
  const isDesktop = useIsDesktop();
  const vhPerItem = isDesktop ? 90 : 62;
  const current = whyReasons[active];

  return (
    <section ref={ref} style={{ height: `${count * vhPerItem}vh` }} className="relative bg-navy-deeper">
      <div className="sticky top-0 flex h-[100svh] w-full flex-col md:flex-row">
        {/* Image */}
        <div className="relative h-[38vh] w-full md:h-full md:w-1/2">
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
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper/80 via-navy-deeper/10 to-navy-deeper/30 md:bg-gradient-to-r" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* List */}
        <div className="flex w-full flex-1 flex-col justify-center px-6 py-8 md:w-1/2 md:px-14">
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
                    "border-b border-white/10 py-3.5 transition-all duration-500 md:py-4",
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
                    <h3
                      className={cn(
                        "font-display text-[17px] font-medium leading-snug text-white transition-all md:text-[22px]",
                        isActive ? "translate-x-0" : "translate-x-0"
                      )}
                    >
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
                        className="ml-9 mt-2 max-w-md overflow-hidden text-[13px] leading-relaxed text-white/55 md:text-sm"
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
