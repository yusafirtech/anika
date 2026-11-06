"use client";

import Link from "next/link";
import ProjectStoryDesktop from "./ProjectStoryDesktop";
import ProjectStoryMobile from "./ProjectStoryMobile";
import type { Dictionary } from "@/i18n/dictionaries";
import en from "@/i18n/dictionaries/en";

export default function ProjectStory({ dict = en.home }: { dict?: Dictionary["home"] }) {
  return (
    <section className="relative bg-mist py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
          {dict.fromCapabilityEyebrow}
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[28px] font-medium leading-tight text-navy-deeper md:text-[44px]">
          {dict.whatWeWorkedOnHeading}
        </h2>
      </div>

      {/* Mobile: simple stacked cards, no scroll-jacking */}
      <div className="md:hidden">
        <ProjectStoryMobile />
      </div>

      {/* Desktop: automatic swiper */}
      <div className="hidden md:block">
        <ProjectStoryDesktop dict={dict} />
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-5 text-center md:mt-4 md:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
        >
          {dict.viewAllProjects}
          <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
