import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { exportCategories } from "@/data/export";

export default function ExportCategories() {
  return (
    <section id="categories" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
            Product Categories
          </p>
          <h2 className="mt-4 max-w-lg font-display text-[28px] font-medium leading-tight text-navy-deeper md:text-[36px]">
            Bangladesh-Origin Products for International Buyers
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {exportCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.06}>
              <Link
                href="/export/products"
                className="group relative block h-[26vh] overflow-hidden rounded-2xl md:h-[34vh]"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(min-width: 768px) 24vw, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper/80 via-navy-deeper/10 to-transparent" />
                <span className="absolute bottom-4 left-4 text-sm font-semibold tracking-wide text-white">
                  {cat.label}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
