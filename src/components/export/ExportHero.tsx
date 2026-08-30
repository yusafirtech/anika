import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function ExportHero() {
  return (
    <section className="relative flex h-[80vh] min-h-[560px] w-full items-center overflow-hidden bg-navy-deeper">
      <Image
        src="/images/story-international-trade.jpg"
        alt="International trade and export from Bangladesh"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper via-navy-deeper/55 to-navy-deeper/40" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
            International B2B
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-5 font-display text-[38px] font-medium leading-[1.05] text-white md:text-[56px]">
            Export From Bangladesh
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/65 md:text-base">
            Connecting Bangladesh-origin products with international buyers.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/export/products"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[13px] font-semibold tracking-wide text-navy-deeper transition-transform hover:scale-[1.03]"
            >
              EXPLORE PRODUCTS
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-white/10"
            >
              SEND YOUR REQUIREMENT
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
