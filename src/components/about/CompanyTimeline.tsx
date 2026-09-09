import CompanyTimelineDesktop from "./CompanyTimelineDesktop";
import CompanyTimelineMobile from "./CompanyTimelineMobile";

type TimelineStage = { id: string; label: string; title: string; description: string; image: string };

export default function CompanyTimeline({ timeline }: { timeline?: TimelineStage[] }) {
  return (
    <section className="bg-navy-deeper pb-16 md:pb-0">
      <div className="mx-auto max-w-6xl px-6 pt-20 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
          Company Story
        </p>
        <h2 className="mt-4 max-w-xl font-display text-[28px] font-medium leading-tight text-white md:text-[40px]">
          From One Capability to a Connected Business
        </h2>
      </div>

      <div className="md:hidden">
        <CompanyTimelineMobile timeline={timeline} />
      </div>
      <div className="hidden md:block">
        <CompanyTimelineDesktop timeline={timeline} />
      </div>
    </section>
  );
}
