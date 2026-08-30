import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

export default function AboutIntro() {
  return (
    <section className="bg-paper pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-[1fr_0.9fr] md:gap-16 md:px-8">
        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
              About ANIKA
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 font-display text-[34px] font-medium leading-[1.08] text-navy-deeper md:text-[48px]">
              A Diversified Business Company Built Around Opportunity.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/60">
              ANIKA TRADING &amp; CO. is a Bangladesh-based diversified business
              company involved in construction, government projects,
              government and private supply, distribution, import and
              trading, and international export. Rather than specializing in
              a single sector, ANIKA is built to move across several
              connected ones.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="brand-gradient-line mt-8 w-16" />
          </Reveal>
        </div>
        <Reveal delay={0.1} className="relative h-[46vh] w-full overflow-hidden rounded-2xl md:h-auto">
          <Image
            src="/images/story-agriculture-origin.jpg"
            alt="Bangladesh-origin agricultural sourcing"
            fill
            sizes="(min-width: 768px) 42vw, 90vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
