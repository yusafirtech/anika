import Link from "next/link";
import CatalogProductCard from "@/components/export/CatalogProductCard";
import type { ExportProduct } from "@/types/cms";
import type { Dictionary } from "@/i18n/dictionaries";
import en from "@/i18n/dictionaries/en";

export default function HomeFeaturedExports({
  products,
  dict = en.home,
  productDict = en.product,
}: {
  products: ExportProduct[];
  dict?: Dictionary["home"];
  productDict?: Dictionary["product"];
}) {
  const featured = products.slice(0, 4);
  if (featured.length === 0) return null;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="flex flex-col items-start justify-between gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
              {dict.featuredExportEyebrow}
            </p>
            <h2 className="mt-3 max-w-xl font-display text-[30px] font-medium leading-tight text-navy-deeper md:text-[40px]">
              {dict.featuredExportHeading}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/60">{dict.featuredExportDescription}</p>
          </div>
          <Link
            href="/export"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-deeper"
          >
            {dict.viewAllExportProducts} <span aria-hidden>&rarr;</span>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {featured.map((product) => (
            <CatalogProductCard key={product.slug} product={product} labels={productDict} />
          ))}
        </div>
      </div>
    </section>
  );
}
