import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/export/ProductGallery";
import CatalogProductCard, { isCertified } from "@/components/export/CatalogProductCard";
import InsightCard from "@/components/insights/InsightCard";
import {
  SITE_URL,
  absoluteUrl,
  getExportContent,
  getInsight,
  getInsights,
  jsonLd,
  resolveImageUrl,
} from "@/lib/cms";
import type { ExportProduct, Insight } from "@/types/cms";

type Props = { params: Promise<{ slug: string }> };

async function findProduct(slug: string) {
  const content = await getExportContent();
  return { product: content.products.find((p) => p.slug === slug), products: content.products };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await findProduct(slug);
  if (!product) return { title: "Product not found" };

  const seo = product.seo;
  const title = seo?.metaTitle || product.name;
  const description = seo?.metaDescription || product.summary;
  const image = absoluteUrl(seo?.ogImage || product.image);

  return {
    title: seo?.metaTitle ? { absolute: seo.metaTitle } : product.name,
    description,
    keywords: seo?.keywords ? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    alternates: { canonical: `/export/products/${product.slug}` },
    robots: seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      title,
      description,
      url: `/export/products/${product.slug}`,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

/** An insight URL is "ours" if it's a relative /insights/ path or points at this site. */
function internalInsightSlug(url: string): string | null {
  const path = url.startsWith(SITE_URL) ? url.slice(SITE_URL.length) : url;
  return path.match(/^\/insights\/([^/?#]+)/)?.[1] ?? null;
}

function externalHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function relatedProducts(product: ExportProduct, all: ExportProduct[]) {
  const others = all.filter((p) => p.slug !== product.slug);
  const sameCategory = others.filter((p) => p.category === product.category);
  return [...sameCategory, ...others.filter((p) => p.category !== product.category)].slice(0, 4);
}

const REASSURANCES = [
  "Quotes usually within 24 hours",
  "Bulk buyers in Bangladesh can request local supply",
  "Specifications and documentation shared on request",
];

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const { product, products } = await findProduct(slug);
  if (!product) notFound();

  const insightUrl = product.insightUrl?.trim() || "";
  const linkedSlug = insightUrl ? internalInsightSlug(insightUrl) : null;
  const [linkedInsight, taggedInsights] = await Promise.all([
    linkedSlug ? getInsight(linkedSlug) : Promise.resolve(null),
    getInsights({ product: product.slug, limit: 6 }),
  ]);

  const insights: Insight[] = [
    ...(linkedInsight ? [linkedInsight] : []),
    ...taggedInsights.filter((i) => i.slug !== linkedInsight?.slug),
  ].slice(0, 3);
  const externalInsight = insightUrl && !linkedSlug && /^https?:\/\//.test(insightUrl) ? insightUrl : null;

  const gallery = (product.images && product.images.length > 0 ? product.images : [product.image]).map(
    resolveImageUrl
  );
  const certifications = isCertified(product) ? product.certifications! : [];
  const related = relatedProducts(product, products);
  const quoteHref = `/contact?product=${encodeURIComponent(product.slug)}`;
  const categoryHref = `/export?category=${encodeURIComponent(product.category)}#catalog`;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.seo?.metaDescription || product.summary,
      image: gallery.map((img) => absoluteUrl(img)),
      sku: product.slug,
      category: product.category,
      brand: { "@type": "Brand", name: "ANIKA TRADING & CO." },
      countryOfOrigin: product.origin ? { "@type": "Country", name: product.origin } : undefined,
      url: `${SITE_URL}/export/products/${product.slug}`,
      additionalProperty: [
        { "@type": "PropertyValue", name: "Minimum Order Quantity", value: product.moq },
        { "@type": "PropertyValue", name: "Availability", value: product.availability },
        ...(product.specifications || []).map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
      ],
      hasCertification: certifications.length
        ? certifications.map((c) => ({ "@type": "Certification", name: c.title, description: c.description }))
        : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Export Products", item: `${SITE_URL}/export` },
        {
          "@type": "ListItem",
          position: 3,
          name: product.category,
          item: `${SITE_URL}/export?category=${encodeURIComponent(product.category)}`,
        },
        { "@type": "ListItem", position: 4, name: product.name, item: `${SITE_URL}/export/products/${product.slug}` },
      ],
    },
  ];

  return (
    <div className="bg-paper pb-24 pt-28 md:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-ink/45">
          <Link href="/" className="hover:text-navy">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href="/export" className="hover:text-navy">
            Export Products
          </Link>
          <span aria-hidden>/</span>
          <Link href={categoryHref} className="hover:text-navy">
            {product.category}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink/70">{product.name}</span>
        </nav>

        {/* Main */}
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <ProductGallery images={gallery} productName={product.name} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={categoryHref}
                className="rounded-full bg-navy/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy hover:bg-navy/10"
              >
                {product.category}
              </Link>
              {certifications.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {certifications.length} {certifications.length === 1 ? "Certification" : "Certifications"}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-[30px] font-medium leading-tight text-navy-deeper md:text-[40px]">
              {product.name}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/65">{product.summary}</p>

            <dl className="mt-7 grid grid-cols-1 overflow-hidden rounded-2xl border border-black/[0.08] bg-white sm:grid-cols-3">
              {[
                { label: "Minimum Order", value: product.moq },
                { label: "Origin", value: product.origin },
                { label: "Availability", value: product.availability },
              ].map((a, i) => (
                <div
                  key={a.label}
                  className={`px-5 py-4 ${i > 0 ? "border-t border-black/[0.08] sm:border-l sm:border-t-0" : ""}`}
                >
                  <dt className="text-[11px] uppercase tracking-[0.15em] text-ink/45">{a.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink/85">{a.value || "On request"}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={quoteHref}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-navy px-7 py-4 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-navy-deeper"
              >
                REQUEST A QUOTE
              </Link>
              <Link
                href={categoryHref}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-navy/20 bg-white px-7 py-4 text-center text-[13px] font-semibold tracking-wide text-navy transition-colors hover:bg-navy/5"
              >
                MORE IN {product.category.toUpperCase()}
              </Link>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-ink/60">
              {REASSURANCES.map((line) => (
                <li key={line} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Specifications + certifications */}
        {((product.specifications?.length ?? 0) > 0 || certifications.length > 0) && (
          <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            {(product.specifications?.length ?? 0) > 0 && (
              <section>
                <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
                  Specifications
                </h2>
                <dl className="mt-5 divide-y divide-black/[0.08] overflow-hidden rounded-2xl border border-black/[0.08] bg-white">
                  {product.specifications.map((spec) => (
                    <div
                      key={spec.label}
                      className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-5 py-3.5 odd:bg-mist/50"
                    >
                      <dt className="text-sm font-medium text-ink/50">{spec.label}</dt>
                      <dd className="text-sm text-ink/80">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {certifications.length > 0 && (
              <section>
                <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
                  Certifications
                </h2>
                <ul className="mt-5 space-y-3">
                  {certifications.map((cert) => (
                    <li key={cert.id} className="flex gap-4 rounded-2xl border border-black/[0.08] bg-white p-4">
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-mist">
                        {cert.image ? (
                          <Image
                            src={resolveImageUrl(cert.image)}
                            alt={cert.title}
                            fill
                            sizes="64px"
                            className="object-contain p-1.5"
                          />
                        ) : (
                          <svg
                            width="26"
                            height="26"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="text-emerald-600"
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12l2 2 4-4m5.6-3.4A11.95 11.95 0 0112 2.9a11.95 11.95 0 01-8.6 3.7A12 12 0 003 9c0 5.6 3.8 10.3 9 11.6 5.2-1.3 9-6 9-11.6 0-1-.1-2-.4-2.9z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-semibold text-navy-deeper">{cert.title}</h3>
                        {cert.description && (
                          <p className="mt-1 text-sm leading-relaxed text-ink/60">{cert.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {/* Insights */}
        {(insights.length > 0 || externalInsight) && (
          <section className="mt-16">
            <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
              Insights &amp; News About This Product
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
              {externalInsight && (
                <a
                  href={externalInsight}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between rounded-2xl border border-black/[0.07] bg-white p-6 transition-shadow hover:shadow-xl hover:shadow-navy-deeper/10"
                >
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-teal">Featured article</span>
                    <p className="mt-3 font-display text-lg font-medium leading-snug text-navy-deeper">
                      Read more about {product.name}
                    </p>
                    <p className="mt-2 break-all text-sm text-ink/50">{externalHost(externalInsight)}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-all group-hover:gap-2.5">
                    Open article <span aria-hidden>&#8599;</span>
                  </span>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-black/[0.08] pt-12">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-[24px] font-medium text-navy-deeper md:text-[28px]">You may also need</h2>
              <Link href="/export#catalog" className="shrink-0 text-sm font-semibold text-navy hover:underline">
                Browse all products &rarr;
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <CatalogProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
