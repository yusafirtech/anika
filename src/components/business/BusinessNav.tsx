"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { businessVerticals as defaultBusinessVerticals, type BusinessVertical } from "@/data/business";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/cms";

export default function BusinessNav({
  businessVerticals = defaultBusinessVerticals,
}: {
  businessVerticals?: BusinessVertical[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const previewItem =
    businessVerticals.find((v) => v.id === hovered) ?? businessVerticals[0];

  return (
    <section className="bg-navy-deeper py-6 md:py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-[1.3fr_1fr] md:gap-14 md:px-8">
        <ul onMouseLeave={() => setHovered(null)}>
          {businessVerticals.map((v) => (
            <li key={v.id} className="border-b border-white/10">
              <a
                href={`#${v.id}`}
                onMouseEnter={() => setHovered(v.id)}
                className="group flex items-center justify-between gap-4 py-4 md:py-7"
              >
                <span className="flex min-w-0 items-center gap-4 md:items-baseline md:gap-5">
                  <span className="relative hidden h-12 w-12 shrink-0 overflow-hidden rounded-lg sm:block md:hidden">
                    <Image
                      src={resolveImageUrl(v.image)}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <span className="font-display text-sm tracking-widest text-white/35">
                    {v.index}
                  </span>
                  <span className="truncate font-display text-[17px] font-medium text-white transition-transform duration-300 group-hover:translate-x-2 sm:text-[20px] md:text-[28px]">
                    {v.title}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-lg text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-teal-light"
                >
                  &rarr;
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="relative hidden h-[420px] overflow-hidden rounded-2xl md:block">
          <AnimatePresence mode="sync">
            <motion.div
              key={previewItem.id}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={resolveImageUrl(previewItem.image)}
                alt={previewItem.title}
                fill
                sizes="35vw"
                className={cn("object-cover transition-all duration-500")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper/70 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
