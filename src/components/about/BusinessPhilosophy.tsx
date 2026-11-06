import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { resolveImageUrl } from "@/lib/cms";
import type { Dictionary } from "@/i18n/dictionaries";
import en from "@/i18n/dictionaries/en";

export default function BusinessPhilosophy({
  image = "/images/trade-detail.jpg",
  dict = en.aboutExtra,
}: {
  image?: string;
  dict?: Dictionary["aboutExtra"];
}) {
  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-[0.85fr_1.15fr] md:gap-16 md:px-8">
        <Reveal className="relative h-[42vh] overflow-hidden rounded-2xl md:h-auto">
          <Image
            src={resolveImageUrl(image)}
            alt="ANIKA business operations detail"
            fill
            sizes="(min-width: 768px) 38vw, 90vw"
            className="object-cover"
          />
        </Reveal>
        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
              {dict.philosophyEyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[30px] font-medium leading-tight text-navy-deeper md:text-[40px]">
              {dict.philosophyHeading}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink/60">
              {dict.philosophyText}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <Link
              href="/business"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-navy px-6 py-3 text-[13px] font-semibold tracking-wide text-white transition-transform hover:scale-[1.03]"
            >
              {dict.philosophyCta}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
