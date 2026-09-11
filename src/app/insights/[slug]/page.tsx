import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { formatInsightDate, parseContent, readingMinutes, toIsoDate } from "@/lib/insights";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) return { title: "Insight not found" };

  const description = insight.metaDescription || insight.excerpt;
  const image = absoluteUrl(insight.coverImage);

  return {
    title: insight.metaTitle ? { absolute: insight.metaTitle } : insight.title,
    description,
    keywords: insight.keywords
      ? insight.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : undefined,
    alternates: { canonical: `/insights/${insight.slug}` },
    openGraph: {
      type: "article",
      title: insight.metaTitle || insight.title,
      description,
      url: `/insights/${insight.slug}`,
      publishedTime: toIsoDate(insight.publishedAt),
      modifiedTime: toIsoDate(insight.updatedAt),
      authors: insight.author ? [insight.author] : undefined,
      images: image ? [{ url: image, alt: insight.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: insight.metaTitle || insight.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) notFound();

  const [latest, exportContent] = await Promise.all([
    getInsights({ limit: 4 }),
    insight.relatedProductSlug ? getExportContent() : Promise.resolve(null),
  ]);

  const relatedProduct = exportContent?.products.find((p) => p.slug === insight.relatedProductSlug);
  const more = latest.filter((i) => i.slug !== insight.slug).slice(0, 3);
  const blocks = parseContent(insight.content);
  const date = formatInsightDate(insight.publishedAt);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: insight.title,
      description: insight.metaDescription || insight.excerpt,
      image: insight.coverImage ? [absoluteUrl(insight.coverImage)] : undefined,
      datePublished: toIsoDate(insight.publishedAt),
      dateModified: toIsoDate(insight.updatedAt) || toIsoDate(insight.publishedAt),
      author: { "@type": "Organization", name: insight.author || "ANIKA TRADING & CO." },
      publisher: {
        "@type": "Organization",
        name: "ANIKA TRADING & CO.",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/images/anika-official-logo.png` },
      },
      mainEntityOfPage: `${SITE_URL}/insights/${insight.slug}`,
      keywords: insight.keywords || undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Insights", item: `${SITE_URL}/insights` },
        { "@type": "ListItem", position: 3, name: insight.title, item: `${SITE_URL}/insights/${insight.slug}` },
      ],
    },
  ];

  return (
    <article className="bg-paper pb-24 pt-28 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />

      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-ink/45">
          <Link href="/" className="hover:text-navy">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href="/insights" className="hover:text-navy">
            Insights
          </Link>
          <span aria-hidden>/</span>
          <Link href={`/insights?category=${encodeURIComponent(insight.category)}`} className="hover:text-navy">
            {insight.category}
          </Link>
        </nav>

        <span className="mt-8 inline-block rounded-full bg-teal/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal">
          {insight.category}
        </span>
        <h1 className="mt-4 font-display text-[32px] font-medium leading-[1.12] text-navy-deeper md:text-[46px]">
          {insight.title}
        </h1>
        {insight.excerpt && <p className="mt-5 text-lg leading-relaxed text-ink/65">{insight.excerpt}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-black/10 pb-6 text-sm text-ink/50">
          {insight.author && <span className="font-medium text-ink/70">{insight.author}</span>}
          {insight.author && date && <span aria-hidden>&middot;</span>}
          {date && <time dateTime={toIsoDate(insight.publishedAt)}>{date}</time>}
          <span aria-hidden>&middot;</span>
          <span>{readingMinutes(insight.content)} min read</span>
        </div>
      </div>

      {insight.coverImage && (
        <div className="mx-auto mt-10 max-w-5xl px-6 md:px-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-mist">
            <Image
              src={resolveImageUrl(insight.coverImage)}
              alt={insight.title}
              fill
              priority
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="mx-auto mt-12 max-w-3xl px-6 md:px-8">
        <div className="space-y-6 text-[17px] leading-[1.8] text-ink/80">
          {blocks.map((block, i) => {
            if (block.type === "h2")
              return (
                <h2 key={i} className="pt-4 font-display text-[26px] font-medium leading-tight text-navy-deeper">
                  {block.text}
                </h2>
              );
            if (block.type === "h3")
              return (
                <h3 key={i} className="pt-2 text-[19px] font-semibold text-navy-deeper">
                  {block.text}
                </h3>
              );
            if (block.type === "ul")
              return (
                <ul key={i} className="space-y-2.5 pl-1">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            return <p key={i}>{block.text}</p>;
          })}
        </div>

        {relatedProduct && (
          <aside className="mt-14 overflow-hidden rounded-2xl border border-black/[0.08] bg-white">
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-48 w-full shrink-0 bg-mist sm:h-auto sm:w-56">
                <Image
                  src={resolveImageUrl(relatedProduct.image)}
                  alt={relatedProduct.name}
                  fill
                  sizes="(min-width: 640px) 14rem, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-teal">
                  Product in this article
                </span>
                <h2 className="mt-2 font-display text-xl font-medium text-navy-deeper">{relatedProduct.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/60">{relatedProduct.summary}</p>
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink/55">
                  <div>
                    <dt className="inline">MOQ: </dt>
                    <dd className="inline font-medium text-ink/75">{relatedProduct.moq}</dd>
                  </div>
                  <div>
                    <dt className="inline">Origin: </dt>
                    <dd className="inline font-medium text-ink/75">{relatedProduct.origin}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/contact?product=${encodeURIComponent(relatedProduct.slug)}`}
                    className="inline-flex items-center rounded-full bg-navy px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-navy-deeper"
                  >
                    Request a Quote
                  </Link>
                  <Link
                    href={`/export/products/${relatedProduct.slug}`}
                    className="inline-flex items-center rounded-full border border-navy/20 px-5 py-2.5 text-[13px] font-semibold text-navy transition-colors hover:bg-navy/5"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        )}

        <div className="mt-12 border-t border-black/10 pt-6">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy transition-all hover:gap-3"
          >
            <span aria-hidden>&larr;</span> All insights
          </Link>
        </div>
      </div>

      {more.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-6 md:px-8">
          <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
            More insights
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((i) => (
              <InsightCard key={i.id} insight={i} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
