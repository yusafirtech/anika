import Reveal from "@/components/ui/Reveal";

type MissionVisionProps = {
  missionTitle?: string;
  missionText?: string;
  visionTitle?: string;
  visionText?: string;
};

export default function MissionVision({
  missionTitle = "Our Mission",
  missionText = "To deliver reliable construction, supply, distribution and trading solutions while building long-term relationships with clients, partners and international buyers.",
  visionTitle = "Our Vision",
  visionText = "To grow as a trusted and internationally connected Bangladesh-based business company, creating sustainable opportunities across construction, supply, distribution and global trade.",
}: MissionVisionProps) {
  return (
    <section id="mission" className="bg-navy-deeper py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 md:grid-cols-2 md:gap-10 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
            {missionTitle}
          </p>
          <p className="mt-6 font-display text-[24px] font-medium leading-snug text-white md:text-[30px]">
            {missionText}
          </p>
        </Reveal>
        <Reveal delay={0.12} className="md:border-l md:border-white/10 md:pl-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
            {visionTitle}
          </p>
          <p className="mt-6 font-display text-[24px] font-medium leading-snug text-white md:text-[30px]">
            {visionText}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
