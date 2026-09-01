import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getRelatedProjects, projects } from "@/data/projects";
import Reveal from "@/components/ui/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(slug);

  return (
    <>
      <section className="relative h-[62vh] w-full overflow-hidden bg-navy-deeper md:h-[75vh]">
        <Image
          src={project.image}
          alt={project.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper via-navy-deeper/30 to-navy-deeper/50" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-14 md:px-8 md:pb-16">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
                {project.category} &middot; {project.location}
              </span>
              <h1 className="mt-4 max-w-2xl font-display text-[32px] font-medium leading-tight text-white md:text-[48px]">
                {project.name}
              </h1>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 md:grid-cols-[0.8fr_1.2fr] md:px-8">
          <Reveal>
            <div className="static flex flex-col gap-6 md:sticky md:top-28">
              <div>
                <span className="block text-[11px] uppercase tracking-[0.2em] text-ink/40">Year</span>
                <span className="text-sm text-ink/70">{project.year}</span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-[0.2em] text-ink/40">Status</span>
                <span className="text-sm text-ink/70">{project.status}</span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-[0.2em] text-ink/40">Location</span>
                <span className="text-sm text-ink/70">{project.location}</span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-[0.2em] text-ink/40">Category</span>
                <span className="text-sm text-ink/70">{project.category}</span>
              </div>
              <Link
                href="/contact"
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-navy px-6 py-3 text-[13px] font-semibold tracking-wide text-white transition-transform hover:scale-[1.03]"
              >
                DISCUSS A PROJECT
              </Link>
            </div>
          </Reveal>

          <div className="flex flex-col gap-14">
            <Reveal>
              <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
                Project Overview
              </h2>
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink/70">
                {project.overview}
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
                Scope
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {project.scope.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-ink/70">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
                Execution
              </h2>
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink/70">
                {project.execution}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
                Visual Documentation
              </h2>
              <div className="relative mt-4 h-[42vh] w-full overflow-hidden rounded-2xl">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(min-width: 768px) 60vw, 90vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-xs text-ink/40">
                Additional site documentation to be added as it becomes available.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-black/5 bg-mist py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
              Related Projects
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {related.map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} className="group">
                  <div className="relative h-[30vh] w-full overflow-hidden rounded-2xl">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 768px) 40vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-medium text-navy-deeper">
                    {p.name}
                  </h3>
                  <span className="text-xs uppercase tracking-widest text-ink/40">
                    {p.category}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
