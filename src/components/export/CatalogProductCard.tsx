import Image from "next/image";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/cms";
import { cn } from "@/lib/utils";
import type { ExportProduct } from "@/types/cms";

export function isCertified(product: ExportProduct): boolean {
  return !!product.certificationsEnabled && (product.certifications?.length ?? 0) > 0;
}

function CertifiedBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Certified{count > 1 ? ` ×${count}` : ""}
    </span>
  );
}

function ProductImage({ product, sizes }: { product: ExportProduct; sizes: string }) {
  const second = product.images?.find((img) => img && img !== product.image);
  return (
    <>
      <Image
        src={resolveImageUrl(product.image)}
        alt={product.name}
        fill
        sizes={sizes}
        className={cn("object-cover transition-all duration-500", second ? "group-hover:opacity-0" : "group-hover:scale-105")}
      />
      {second && (
        <Image
          src={resolveImageUrl(second)}
          alt=""
          fill
          sizes={sizes}
          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
    </>
  );
}

export default function CatalogProductCard({
  product,
  view = "grid",
}: {
  product: ExportProduct;
  view?: "grid" | "list";
}) {
  const href = `/export/products/${product.slug}`;
  const quoteHref = `/contact?product=${encodeURIComponent(product.slug)}`;
  const certified = isCertified(product);

  const attributes = [
    { label: "MOQ", value: product.moq },
    { label: "Origin", value: product.origin },
    { label: "Availability", value: product.availability },
  ].filter((a) => a.value);

  if (view === "list") {
    return (
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-shadow hover:shadow-xl hover:shadow-navy-deeper/[0.07] sm:flex-row">
        <Link href={href} className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden bg-mist sm:aspect-auto sm:w-64">
          <ProductImage product={product} sizes="(min-width: 640px) 16rem, 100vw" />
          {certified && (
            <span className="absolute left-3 top-3">
              <CertifiedBadge count={product.certifications!.length} />
            </span>
          )}
        </Link>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-teal">{product.category}</span>
          <Link href={href}>
            <h3 className="mt-1.5 font-display text-[20px] font-medium leading-snug text-navy-deeper transition-colors group-hover:text-navy">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/60">{product.summary}</p>

          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1.5 text-[13px] sm:grid-cols-3">
            {attributes.map((a) => (
              <div key={a.label} className="flex gap-2 sm:flex-col sm:gap-0">
                <dt className="text-ink/45">{a.label}</dt>
                <dd className="font-medium text-ink/80">{a.value}</dd>
              </div>
            ))}
          </dl>

          {(product.specifications?.length ?? 0) > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.specifications.slice(0, 4).map((spec) => (
                <span
                  key={spec.label}
                  className="rounded-md bg-mist px-2 py-1 text-[11px] text-ink/65"
                  title={`${spec.label}: ${spec.value}`}
                >
                  <span className="text-ink/45">{spec.label}:</span> {spec.value}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-auto sm:pt-5">
            <Link
              href={quoteHref}
              className="inline-flex items-center justify-center rounded-full bg-navy px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-navy-deeper"
            >
              Request a Quote
            </Link>
            <Link
              href={href}
              className="inline-flex items-center justify-center rounded-full border border-navy/20 px-5 py-2.5 text-[13px] font-semibold text-navy transition-colors hover:bg-navy/5"
            >
              View Details
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-navy-deeper/[0.08]">
      <Link href={href} className="relative block aspect-square w-full overflow-hidden bg-mist">
        <ProductImage product={product} sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 100vw" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-navy-deeper backdrop-blur-sm">
          {product.category}
        </span>
        {certified && (
          <span className="absolute right-3 top-3">
            <CertifiedBadge count={product.certifications!.length} />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={href}>
          <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-snug text-navy-deeper transition-colors group-hover:text-navy">
            {product.name}
          </h3>
        </Link>

        <dl className="mt-3 space-y-1 text-[12.5px]">
          {attributes.map((a) => (
            <div key={a.label} className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 text-ink/45">{a.label}</dt>
              <dd className="truncate text-right font-medium text-ink/80" title={a.value}>
                {a.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <Link
            href={quoteHref}
            className="inline-flex items-center justify-center rounded-full bg-navy px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-navy-deeper"
          >
            Get Quote
          </Link>
          <Link
            href={href}
            className="inline-flex items-center justify-center rounded-full border border-navy/20 px-3 py-2 text-[12px] font-semibold text-navy transition-colors hover:bg-navy/5"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
