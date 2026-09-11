import type { Metadata } from "next";
import Link from "next/link";
import InsightCard from "@/components/insights/InsightCard";
import { getInsights } from "@/lib/cms";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Insights & News",
  description:
    "Industry news, market insights, and product updates on Bangladesh seafood, agricultural exports, construction, and institutional supply from ANIKA TRADING & CO.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights & News | ANIKA TRADING & CO.",
    description: "Industry news, market insights, and product updates from ANIKA TRADING & CO.",
    type: "website",
  },
};

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category: rawCategory } = await searchParams;
  const activeCategory = typeof rawCategory === "string" ? rawCategory : "All";

  const all = await getInsights();
  const categories = ["All", ...Array.from(new Set(all.map((i) => i.category)))];
  const insights = activeCategory === "All" ? all : all.filter((i) => i.category === activeCategory);
  const [lead, ...rest] = insights;

  return (
    <div className="bg-paper pb-28 pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">Insights &amp; News</p>
        <h1 className="mt-5 max-w-3xl font-display text-[36px] font-medium leading-[1.08] text-navy-deeper md:text-[52px]">
          Trade, Supply &amp; Export Insights
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/60 md:text-base">
          Market news, product updates, and practical guidance for buyers and partners working with Bangladesh.
        </p>

        {categories.length > 2 && (
          <nav aria-label="Filter by category" className="mt-10 flex flex-wrap gap-2.5 border-b border-black/10 pb-8">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === "All" ? "/insights" : `/insights?category=${encodeURIComponent(cat)}`}
                scroll={false}
                className={cn(
                  "rounded-full border px-5 py-2 text-[13px] font-medium transition-colors",
                  cat === activeCategory
                    ? "border-navy bg-navy text-white"
                    : "border-black/15 text-ink/60 hover:border-navy/40 hover:text-navy"
                )}
              >
                {cat}
              </Link>
            ))}
          </nav>
        )}

        {!lead ? (
          <div className="mt-14 rounded-2xl border border-dashed border-black/15 bg-white px-6 py-20 text-center">
            <p className="font-display text-xl text-navy-deeper">No insights published yet</p>
            <p className="mt-2 text-sm text-ink/55">Check back soon for news and updates.</p>
          </div>
        ) : (
          <>
            <div className="mt-12">
              <InsightCard insight={lead} variant="featured" />
            </div>
            {rest.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
