"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { partners as defaultPartners } from "@/data/partners";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/cms";
import type { PartnerItem } from "@/types/cms";

export default function PartnersGrid({
  partners = defaultPartners,
}: {
  partners?: PartnerItem[];
}) {
  const active = useMemo(() => partners.filter((p) => p.status === "Active"), [partners]);
  const categories = ["All", ...Array.from(new Set(active.map((p) => p.category)))];
  const [filter, setFilter] = useState("All");
  const filtered = useMemo(
    () => (filter === "All" ? active : active.filter((p) => p.category === filter)),
    [filter, active]
  );

  return (
    <section className="bg-paper pb-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="flex flex-wrap gap-3 border-b border-black/10 pb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full border px-5 py-2 text-[13px] font-medium tracking-wide transition-colors",
                filter === cat
                  ? "border-navy bg-navy text-white"
                  : "border-black/15 text-ink/60 hover:border-navy/40 hover:text-navy"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink/40">No partners in this category yet.</p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((partner) => (
                <motion.div
                  key={partner.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="group overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-mist">
                    <Image
                      src={resolveImageUrl(partner.logo)}
                      alt={partner.name}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper/60 via-transparent to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-navy-deeper/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      {partner.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-[17px] font-semibold leading-tight text-navy-deeper">
                      {partner.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between text-[13px] text-ink/55">
                      <span>{partner.country}</span>
                      <span>Partner since {partner.partnershipYear}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
