import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function BuyerSection() {
  const dict = (await getDictionaryForLocale()).buyerSection;

  return (
    <section className="bg-navy-deeper py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
        <Reveal>
          <h2 className="font-display text-[28px] font-medium leading-tight text-white md:text-[38px]">
            {dict.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">{dict.subheading}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
            {dict.capabilities.map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white/70"
              >
                {c}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <Link
            href="/contact"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[13px] font-semibold tracking-wide text-navy-deeper transition-transform hover:scale-[1.03]"
          >
            {dict.cta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

async function getDictionaryForLocale() {
  return getDictionary(await getLocale());
}
