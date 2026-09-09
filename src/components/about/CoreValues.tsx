"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { coreValues as defaultCoreValues } from "@/data/about";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type CoreValue = { id: string; label: string; description: string };

export default function CoreValues({
  coreValues = defaultCoreValues,
}: {
  coreValues?: CoreValue[];
}) {
  const [activeId, setActiveId] = useState(coreValues[0].id);
  const active = coreValues.find((v) => v.id === activeId)!;

  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <Reveal>
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
            Core Values
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col items-center gap-1 overflow-hidden px-2 md:mt-14 md:gap-2">
          {coreValues.map((value, i) => (
            <Reveal key={value.id} delay={i * 0.05}>
              <button
                onMouseEnter={() => setActiveId(value.id)}
                onFocus={() => setActiveId(value.id)}
                onClick={() => setActiveId(value.id)}
                className={cn(
                  "max-w-full break-words text-center font-display text-[8.5vw] font-medium leading-[1.1] tracking-tight transition-all duration-300 sm:text-[7vw] md:text-[64px] md:leading-[1.05]",
                  value.id === activeId ? "brand-gradient-text" : "text-navy-deeper/15 hover:text-navy-deeper/30"
                )}
              >
                {value.label}
              </button>
            </Reveal>
          ))}
        </div>

        <motion.p
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto mt-8 max-w-md text-center text-sm leading-relaxed text-ink/55 md:mt-10"
        >
          {active.description}
        </motion.p>
      </div>
    </section>
  );
}
