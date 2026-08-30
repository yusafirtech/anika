import Reveal from "@/components/ui/Reveal";
import { exportProcess } from "@/data/export";

export default function ExportProcess() {
  return (
    <section className="bg-mist py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
            How It Moves
          </p>
        </Reveal>
        <div className="mt-10 flex flex-col gap-0 md:flex-row md:items-start md:gap-0">
          {exportProcess.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.06} className="relative flex-1">
              <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
                <div className="flex items-center gap-3 md:w-full">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy/20 font-display text-sm font-medium text-navy">
                    {i + 1}
                  </span>
                  <span className="h-px flex-1 bg-navy/15 md:hidden" />
                </div>
                <div className="h-px w-full bg-navy/15 hidden md:block md:mt-[-22px] md:mb-4" />
                <div className="pb-8 md:pb-0">
                  <h3 className="font-display text-[15px] font-semibold uppercase tracking-wide text-navy-deeper">
                    {step.step}
                  </h3>
                  <p className="mt-1.5 max-w-[180px] text-[13px] leading-relaxed text-ink/55">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
