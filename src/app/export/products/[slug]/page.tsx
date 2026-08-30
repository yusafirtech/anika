import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { exportProducts, getProductBySlug } from "@/data/export";
import Reveal from "@/components/ui/Reveal";

export function generateStaticParams() {
  return exportProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return { title: product.name, description: product.summary };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <section className="bg-paper pb-24 pt-28 md:pt-36">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          <Reveal className="relative h-[42vh] w-full overflow-hidden rounded-2xl md:h-[55vh]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
              {product.category}
            </span>
            <h1 className="mt-4 font-display text-[30px] font-medium leading-tight text-navy-deeper md:text-[38px]">
              {product.name}
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/60">
              {product.summary}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4 border-y border-black/10 py-5">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-ink/40">
                  Origin
                </span>
                <span className="text-sm font-medium text-ink/75">{product.origin}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-ink/40">
                  Availability
                </span>
                <span className="text-sm font-medium text-ink/75">{product.availability}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-ink/40">
                  MOQ
                </span>
                <span className="text-sm font-medium text-ink/75">{product.moq}</span>
              </div>
            </div>

            <Link
              href="/contact"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-transform hover:scale-[1.03]"
            >
              REQUEST A QUOTE
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-16">
          <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
            Specifications
          </h2>
          <dl className="mt-5 divide-y divide-black/10 overflow-hidden rounded-2xl border border-black/10">
            {product.specifications.map((spec) => (
              <div key={spec.label} className="grid grid-cols-2 gap-4 bg-mist/60 px-6 py-4 odd:bg-white">
                <dt className="text-sm font-medium text-ink/50">{spec.label}</dt>
                <dd className="text-sm text-ink/75">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <Link
            href="/export/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy transition-all hover:gap-3"
          >
            <span aria-hidden>&larr;</span> Back to Product Catalogue
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
