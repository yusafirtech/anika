"use client";

import Link from "next/link";
import { homeProjects } from "@/data/home";
import ProjectStoryItem from "./ProjectStoryItem";

export default function ProjectStory() {
  return (
    <section className="relative bg-mist py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
          From Capability to Execution
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[32px] font-medium leading-tight text-navy-deeper md:text-[44px]">
          What ANIKA Has Actually Worked On
        </h2>
      </div>

      <div className="relative mt-6">
        {homeProjects.map((project, i) => (
          <ProjectStoryItem
            key={project.id}
            project={project}
            index={i}
            total={homeProjects.length}
            top={80 + i * 14}
          />
        ))}
      </div>

      <div className="mx-auto mt-4 max-w-6xl px-5 text-center md:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
        >
          View All Projects
          <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
