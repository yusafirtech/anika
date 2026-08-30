"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { HomeProject } from "@/data/home";

export default function ProjectStoryItem({
  project,
  index,
  total,
  top,
}: {
  project: HomeProject;
  index: number;
  total: number;
  top: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const isLast = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.55]);

  return (
    <div ref={ref} className="sticky h-[100svh] w-full" style={{ top }}>
      <motion.div
        style={{ scale, opacity }}
        className="mx-auto h-full w-full max-w-6xl origin-top px-5 pb-10 pt-6 md:px-8"
      >
        <div className="relative grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-3xl bg-navy-deeper shadow-2xl shadow-navy-deeper/30 md:grid-rows-1 md:grid-cols-2">
          <div className="relative order-2 flex flex-col justify-center px-7 py-8 md:order-1 md:px-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
              {project.category} &middot; {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-[26px] font-medium leading-tight text-white md:text-[36px]">
              {project.name}
            </h3>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/60 md:text-[15px]">
              {project.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-white/50">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Location
                </span>
                {project.location}
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Status
                </span>
                {project.status}
              </div>
            </div>
          </div>
          <div className="relative order-1 h-[220px] md:order-2 md:h-full">
            <Image
              src={project.image}
              alt={project.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper/60 via-transparent to-transparent md:bg-gradient-to-l" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
