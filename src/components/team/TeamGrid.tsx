"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { teamMembers, departments, type TeamMember } from "@/data/team";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

function MemberModal({
  member,
  onClose,
}: {
  member: TeamMember;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-navy-deeper/80 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-paper shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header band */}
          <div className="brand-gradient-bg h-1.5 w-full" />

          <div className="flex flex-col md:flex-row">
            {/* Photo / Avatar */}
            <div className="relative h-56 w-full shrink-0 md:h-auto md:w-52">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(min-width: 768px) 208px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "flex h-full w-full items-center justify-center bg-gradient-to-br",
                    member.gradient
                  )}
                >
                  <span className="font-display text-5xl font-semibold text-white/80">
                    {member.initials}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-7 md:overflow-y-auto md:max-h-[80vh]">
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-ink/40 transition hover:bg-black/10 hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-teal">
                {member.department}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-navy-deeper">
                {member.name}
              </h2>
              <p className="mt-1 text-[13px] font-medium text-ink/50">{member.title}</p>

              <div className="brand-gradient-line mt-4 w-12" />

              <p className="mt-5 text-[14px] leading-[1.75] text-ink/65">
                {member.bio}
              </p>

              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-navy/50">
                  Areas of Expertise
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {member.expertise.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-navy/10 bg-navy/5 px-3 py-1 text-[12px] font-medium text-navy/70"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function MemberCard({
  member,
  onClick,
  index,
}: {
  member: TeamMember;
  onClick: () => void;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={index * 0.07}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        id={`team-member-${member.id}`}
        className="group relative w-full overflow-hidden rounded-2xl border border-black/[0.07] bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* Photo or Gradient avatar */}
        <div className="relative h-72 w-full overflow-hidden">
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(min-width: 768px) 33vw, 90vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                "flex h-full w-full items-center justify-center bg-gradient-to-br transition-transform duration-500 group-hover:scale-105",
                member.gradient
              )}
            >
              <span className="font-display text-7xl font-semibold text-white/40 select-none">
                {member.initials}
              </span>
            </div>
          )}

          {/* Overlay on hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-gradient-to-t from-navy-deeper/80 via-navy-deeper/20 to-transparent"
          />

          {/* View Profile pill */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[12px] font-semibold tracking-wide text-white backdrop-blur-sm"
          >
            VIEW PROFILE
          </motion.div>

          {/* Dept label */}
          <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-navy-deeper/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
            {member.department}
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="font-display text-[17px] font-semibold text-navy-deeper leading-tight">
            {member.name}
          </h3>
          <p className="mt-1 text-[13px] text-ink/55 leading-snug">{member.title}</p>

          <div className="brand-gradient-line mt-4 w-8 transition-all duration-300 group-hover:w-14" />

          <div className="mt-4 flex flex-wrap gap-1.5">
            {member.expertise.slice(0, 2).map((exp) => (
              <span
                key={exp}
                className="rounded-full bg-navy/5 px-2.5 py-1 text-[11px] font-medium text-navy/60"
              >
                {exp}
              </span>
            ))}
            {member.expertise.length > 2 && (
              <span className="rounded-full bg-navy/5 px-2.5 py-1 text-[11px] font-medium text-navy/40">
                +{member.expertise.length - 2} more
              </span>
            )}
          </div>
        </div>
      </button>
    </Reveal>
  );
}

export default function TeamGrid() {
  const [active, setActive] = useState<TeamMember | null>(null);
  const [dept, setDept] = useState("All");

  const filtered =
    dept === "All" ? teamMembers : teamMembers.filter((m) => m.department === dept);

  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {/* Section header */}
        <Reveal>
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
                Leadership & Management
              </p>
              <h2 className="mt-4 font-display text-[30px] font-medium leading-tight text-navy-deeper md:text-[40px]">
                Meet the People Who Run ANIKA
              </h2>
            </div>
            <p className="max-w-sm text-[14px] leading-relaxed text-ink/55">
              Click any card to learn more about their background, role, and areas of expertise.
            </p>
          </div>
        </Reveal>

        {/* Department Filter */}
        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-wrap gap-2">
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[12px] font-semibold tracking-wide transition-all duration-200",
                  d === dept
                    ? "border-navy bg-navy text-white"
                    : "border-black/10 text-ink/55 hover:border-navy/40 hover:text-navy"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((member, i) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <MemberCard
                  member={member}
                  onClick={() => setActive(member)}
                  index={i}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      {active && <MemberModal member={active} onClose={() => setActive(null)} />}
    </section>
  );
}
