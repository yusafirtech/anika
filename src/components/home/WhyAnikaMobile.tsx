"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { whyReasons as defaultWhyReasons, type WhyReason } from "@/data/home";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/cms";

export default function WhyAnikaMobile({
  whyReasons = defaultWhyReasons,
}: {
  whyReasons?: WhyReason[];
}) {
  const [openId, setOpenId] = useState(whyReasons[0].id);

  return (
    <section className="bg-navy-deeper px-5 py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
        Why ANIKA
      </p>

      <div className="mt-6 flex flex-col">
        {whyReasons.map((reason, i) => {
          const isOpen = reason.id === openId;
          return (
            <Reveal key={reason.id} y={12} delay={i * 0.04}>
              <div className="border-b border-white/10">
                <button
                  onClick={() => setOpenId(isOpen ? "" : reason.id)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-baseline gap-3">
                    <span
                      className={cn(
                        "font-display text-sm tracking-widest",
                        isOpen ? "brand-gradient-text" : "text-white/40"
                      )}
                    >
                      {reason.index}
                    </span>
                    <span className="font-display text-[17px] font-medium leading-snug text-white">
                      {reason.title}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-lg text-white/40 transition-transform duration-300",
                      isOpen && "rotate-45 text-teal-light"
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5">
                        <div className="relative h-[30vh] w-full overflow-hidden rounded-2xl">
                          <Image
                            src={resolveImageUrl(reason.image)}
                            alt={reason.title}
                            fill
                            sizes="100vw"
                            className="object-cover"
                          />
                        </div>
                        <p className="mt-3 text-[14px] leading-relaxed text-white/60">
                          {reason.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
