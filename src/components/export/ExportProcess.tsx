import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/dictionaries";
import en from "@/i18n/dictionaries/en";

type ProcessStep = { step: string; description: string };

export default function ExportProcess({
  process: exportProcess,
  dict = en.exportProcess,
}: {
  process?: ProcessStep[];
  dict?: Dictionary["exportProcess"];
}) {
  if (!exportProcess || exportProcess.length === 0) return null;
  const last = exportProcess.length - 1;

  return (
    <section className="bg-mist py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
            {dict.eyebrow}
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

        {/* Desktop: full-width horizontal flow, edge to edge */}
        <div className="relative mt-16 hidden md:flex md:items-start md:justify-between">
          <div className="absolute left-[18px] right-[18px] top-[18px] h-px bg-navy/15" />
          <div className="absolute left-[18px] right-[18px] top-[17px] h-[2px] overflow-hidden">
            <div className="animate-process-flow h-full w-full" />
          </div>

          {exportProcess.map((step, i) => (
            <Reveal
              key={step.step}
              delay={i * 0.06}
              className={cn(
                "relative z-10 flex max-w-[170px] flex-col gap-4",
                i === 0 && "items-start text-left",
                i === last && "items-end text-right",
                i > 0 && i < last && "items-center text-center"
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy/20 bg-mist font-display text-sm font-medium text-navy">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-[15px] font-semibold uppercase tracking-wide text-navy-deeper">
                  {step.step}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink/55">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
