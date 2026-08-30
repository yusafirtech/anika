import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { BusinessVertical } from "@/data/business";

function CapabilityList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2.5 text-sm text-ink/65">
          <span className="h-1 w-1 shrink-0 rounded-full bg-teal" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function CtaLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-navy/25 px-6 py-3 text-[13px] font-semibold tracking-wide text-navy transition-colors hover:bg-navy hover:text-white"
    >
      {label.toUpperCase()}
    </Link>
  );
}

export default function BusinessDetail({
  vertical,
  index,
}: {
  vertical: BusinessVertical;
  index: number;
}) {
  const zebra = index % 2 === 0;

  if (vertical.layout === "banner") {
    return (
      <section id={vertical.id} className="relative overflow-hidden bg-navy-deeper py-0">
        <div className="relative h-[70vh] w-full md:h-[80vh]">
          <Image
            src={vertical.image}
            alt={vertical.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper via-navy-deeper/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-14 md:px-8 md:pb-20">
            <div className="mx-auto max-w-6xl">
              <Reveal>
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
                  {vertical.index} &middot; {vertical.eyebrow}
                </span>
                <h2 className="mt-4 max-w-xl font-display text-[30px] font-medium leading-tight text-white md:text-[42px]">
                  {vertical.title}
                </h2>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/65">
                  {vertical.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  {vertical.capabilities.map((c) => (
                    <span key={c} className="text-[13px] text-white/55">
                      {c}
                    </span>
                  ))}
                </div>
                <Link
                  href="/contact"
                  className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold tracking-wide text-navy-deeper transition-transform hover:scale-[1.03]"
                >
                  {vertical.cta.toUpperCase()}
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const imageFirst = vertical.layout === "reverse";

  return (
    <section id={vertical.id} className={cn("py-20 md:py-28", zebra ? "bg-paper" : "bg-mist")}>
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div
          className={cn(
            "grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16",
          )}
        >
          <Reveal className={cn("relative h-[42vh] overflow-hidden rounded-2xl md:h-[52vh]", imageFirst && "md:order-1")}>
            <Image
              src={vertical.image}
              alt={vertical.title}
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={0.1} className={cn(imageFirst && "md:order-2")}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
              {vertical.index} &middot; {vertical.eyebrow}
            </span>
            <h2 className="mt-4 font-display text-[28px] font-medium leading-tight text-navy-deeper md:text-[36px]">
              {vertical.title}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/60">
              {vertical.description}
            </p>
            <CapabilityList items={vertical.capabilities} />
            <CtaLink href="/contact" label={vertical.cta} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
