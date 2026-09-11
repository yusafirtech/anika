import Link from "next/link";
import InsightCard from "@/components/insights/InsightCard";
import type { Insight } from "@/types/cms";

export default function HomeInsights({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null;

  const [lead, ...rest] = insights;
  const side = rest.slice(0, 3);

  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="flex flex-col items-start justify-between gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">Insights &amp; News</p>
            <h2 className="mt-3 max-w-xl font-display text-[30px] font-medium leading-tight text-navy-deeper md:text-[40px]">
              What&rsquo;s Moving in Trade, Supply &amp; Export
            </h2>
          </div>
          <Link
            href="/insights"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
          >
            View all insights <span aria-hidden>&rarr;</span>
          </Link>
        </div>

        <div className={side.length > 0 ? "mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr]" : "mt-10"}>
          <InsightCard insight={lead} variant="featured" />
          {side.length > 0 && (
            <div className="flex flex-col justify-between gap-6 rounded-2xl border border-black/[0.07] bg-white p-6">
              {side.map((insight, i) => (
                <div key={insight.id} className={i > 0 ? "border-t border-black/[0.07] pt-6" : undefined}>
                  <InsightCard insight={insight} variant="compact" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
