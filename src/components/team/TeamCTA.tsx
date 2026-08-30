import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function TeamCTA() {
  return (
    <section className="bg-mist py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
            Work With Us
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 font-display text-[28px] font-medium leading-tight text-navy-deeper md:text-[40px]">
            Bring Your Business to ANIKA
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-ink/55">
            Whether you are a government institution, a private buyer, or an international importer,
            our team has the depth and experience to meet your requirements — reliably.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-full bg-navy px-7 py-3.5 text-[13px] font-semibold text-white transition-all hover:bg-navy-dark hover:shadow-lg hover:shadow-navy/20"
            >
              Get in Touch
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="translate-x-0 transition-transform group-hover:translate-x-1">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-7 py-3.5 text-[13px] font-semibold text-navy/70 transition-all hover:border-navy hover:text-navy"
            >
              Learn About ANIKA
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
