import Reveal from "@/components/ui/Reveal";
import { exportProcess as defaultExportProcess } from "@/data/export";

type ProcessStep = { step: string; description: string };

export default function ExportProcess({
  process: exportProcess = defaultExportProcess,
}: {
  process?: ProcessStep[];
}) {
  return (
    <section className="bg-mist py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
            How It Moves
          </p>
        </Reveal>

        {/* Mobile: vertical stepper */}
        <div className="relative mt-10 flex flex-col gap-8 md:hidden">
          <div className="absolute left-[17px] top-3 bottom-3 w-px bg-navy/15" />
          {exportProcess.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.05} className="relative flex gap-4 pl-0">
              <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy/20 bg-mist font-display text-sm font-medium text-navy">
                {i + 1}
              </span>
              <div className="pt-1">
                <h3 className="font-display text-[15px] font-semibold uppercase tracking-wide text-navy-deeper">
                  {step.step}
                </h3>
                <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-ink/55">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Desktop: horizontal process */}
        <div className="mt-10 hidden md:flex md:items-start md:gap-0">
          {exportProcess.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.06} className="relative flex-1">
              <div className="flex flex-col items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy/20 font-display text-sm font-medium text-navy">
                  {i + 1}
                </span>
                <div className="-mt-[22px] mb-4 h-px w-full bg-navy/15" />
                <div>
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
