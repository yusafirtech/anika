import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

export default function PageIntro({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={cn("mx-auto max-w-3xl px-6 pt-32 pb-14 md:px-8 md:pt-40 md:pb-20", align === "center" && "text-center")}>
      <Reveal>
        <p
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.3em]",
            dark ? "text-teal-light" : "text-navy/60"
          )}
        >
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h1
          className={cn(
            "mt-5 font-display text-[36px] font-medium leading-[1.08] md:text-[52px]",
            dark ? "text-white" : "text-navy-deeper"
          )}
        >
          {title}
        </h1>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "mt-5 text-[15px] leading-relaxed md:text-base",
              dark ? "text-white/60" : "text-ink/60"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
