import Image from "next/image";
import Link from "next/link";
import { businessShowcase as defaultBusinessShowcase, type BusinessShowcaseItem } from "@/data/home";
import Reveal from "@/components/ui/Reveal";
import { resolveImageUrl } from "@/lib/cms";

export default function BusinessShowcaseMobile({
  businessShowcase = defaultBusinessShowcase,
}: {
  businessShowcase?: BusinessShowcaseItem[];
}) {
  return (
    <section className="bg-paper px-5 py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
        What We Do
      </p>
      <h2 className="mt-3 font-display text-[28px] font-medium leading-tight text-navy-deeper">
        A Connected Business Ecosystem
      </h2>

      <div className="mt-10 flex flex-col gap-10">
        {businessShowcase.map((b, i) => (
          <Reveal key={b.id} y={20}>
            <div className="relative h-[34vh] w-full overflow-hidden rounded-2xl">
              <Image
                src={resolveImageUrl(b.image)}
                alt={b.title}
                fill
                sizes="100vw"
                loading={i === 0 ? "eager" : "lazy"}
                className="object-cover"
              />
              <span className="absolute right-3 top-3 rounded-full bg-navy-deeper/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                {b.index}/{String(businessShowcase.length).padStart(2, "0")}
              </span>
            </div>
            <span className="brand-gradient-text mt-4 block font-display text-[13px] font-semibold tracking-[0.2em]">
              BUSINESS {b.index}
            </span>
            <h3 className="mt-2 font-display text-[21px] font-medium leading-tight text-navy-deeper">
              {b.title}
            </h3>
            <p className="mt-2.5 text-[14px] leading-relaxed text-ink/60">{b.description}</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {b.points.map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-[13px] text-ink/65">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-teal" />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={b.href}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy"
            >
              {b.cta} <span aria-hidden>&rarr;</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
