import Reveal from "@/components/ui/Reveal";

export default function MissionVision() {
  return (
    <section id="mission" className="bg-navy-deeper py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 md:grid-cols-2 md:gap-10 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
            Our Mission
          </p>
          <p className="mt-6 font-display text-[24px] font-medium leading-snug text-white md:text-[30px]">
            To deliver reliable construction, supply, distribution and
            trading solutions while building long-term relationships with
            clients, partners and international buyers.
          </p>
        </Reveal>
        <Reveal delay={0.12} className="md:border-l md:border-white/10 md:pl-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
            Our Vision
          </p>
          <p className="mt-6 font-display text-[24px] font-medium leading-snug text-white md:text-[30px]">
            To grow as a trusted and internationally connected
            Bangladesh-based business company, creating sustainable
            opportunities across construction, supply, distribution and
            global trade.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
