import Image from "next/image";
import { resolveImageUrl } from "@/lib/cms";
import type { PartnerItem, BrandClientItem } from "@/types/cms";
import type { Dictionary } from "@/i18n/dictionaries";

type LogoItem = { id: string; name: string; logo: string; tag?: string };

function MarqueeRow({ items, direction }: { items: LogoItem[]; direction: "left" | "right" }) {
  // Duplicate the list so the CSS animation can scroll exactly -50% and loop
  // seamlessly, instead of snapping back to the start.
  const doubled = [...items, ...items];
  return (
    <div
      className="relative overflow-hidden"
      style={{ maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)" }}
    >
      <div
        className={`flex w-max gap-5 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="group relative h-32 w-48 shrink-0 overflow-hidden rounded-2xl border border-black/[0.06] bg-mist shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy-deeper/10"
          >
            <Image
              src={resolveImageUrl(item.logo)}
              alt={item.name}
              fill
              sizes="192px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper/85 via-navy-deeper/10 to-transparent" />
            {item.tag && (
              <span className="absolute left-3 top-3 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                {item.tag}
              </span>
            )}
            <p className="absolute inset-x-3 bottom-3 truncate text-[13px] font-semibold text-white">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BrandMarquee({
  partners,
  clients,
  dict,
}: {
  partners: PartnerItem[];
  clients: BrandClientItem[];
  dict: Dictionary["home"];
}) {
  const partnerLogos: LogoItem[] = partners
    .filter((p) => p.status === "Active" && p.logo)
    .map((p) => ({ id: p.id, name: p.name, logo: p.logo, tag: p.category }));
  const clientLogos: LogoItem[] = clients.filter((c) => c.logo).map((c) => ({ id: c.id, name: c.name, logo: c.logo }));

  if (partnerLogos.length === 0 && clientLogos.length === 0) return null;

  return (
    <section className="overflow-hidden bg-paper py-20 md:py-24">
      <div className="mx-auto max-w-6xl border-b border-black/10 px-6 pb-10 text-center md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">{dict.ourBrandEyebrow}</p>
        <h2 className="mt-3 font-display text-[28px] font-medium leading-tight text-navy-deeper md:text-[36px]">
          {dict.ourBrandHeading}
        </h2>
      </div>

      <div className="mt-12 space-y-5">
        {partnerLogos.length > 0 && <MarqueeRow items={partnerLogos} direction="left" />}
        {clientLogos.length > 0 && <MarqueeRow items={clientLogos} direction="right" />}
      </div>
    </section>
  );
}
