import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

const capabilities = [
  "Browse products",
  "View specifications",
  "Check packaging",
  "Check origin",
  "Ask about quantity",
  "Ask about MOQ",
  "Request pricing",
  "Send an RFQ",
  "Start a business discussion",
];

export default function BuyerSection() {
  return (
    <section className="bg-navy-deeper py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
        <Reveal>
          <h2 className="font-display text-[28px] font-medium leading-tight text-white md:text-[38px]">
            Looking for Products from Bangladesh?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
            International buyers can:
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
            {capabilities.map((c) => (
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
            SEND PRODUCT REQUIREMENT
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
