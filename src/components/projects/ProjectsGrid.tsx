"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

export default function ProjectsGrid() {
  const [filter, setFilter] = useState("All");
  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
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

        <div className="mt-14 flex flex-col gap-20 md:gap-28">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const imageFirst = i % 2 === 0;
              return (
                <motion.div
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14"
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className={cn(
                      "relative block h-[46vh] w-full overflow-hidden rounded-2xl md:h-[56vh]",
                      !imageFirst && "md:order-2"
                    )}
                  >
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      sizes="(min-width: 768px) 45vw, 90vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </Link>
                  <div className={cn(!imageFirst && "md:order-1")}>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
                      {project.category} &middot; {project.location}
                    </span>
                    <h3 className="mt-4 font-display text-[28px] font-medium leading-tight text-navy-deeper md:text-[36px]">
                      {project.name}
                    </h3>
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/60">
                      {project.summary}
                    </p>
                    <div className="mt-5 flex gap-6 text-[13px] text-ink/45">
                      <span>{project.year}</span>
                      <span>{project.status}</span>
                    </div>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy transition-all hover:gap-3"
                    >
                      View Case Study <span aria-hidden>&rarr;</span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
