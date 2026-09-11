import Image from "next/image";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/cms";
import { formatInsightDate } from "@/lib/insights";
import { cn } from "@/lib/utils";
import type { Insight } from "@/types/cms";

export default function InsightCard({
  insight,
  variant = "default",
  dark = false,
}: {
  insight: Insight;
  variant?: "default" | "featured" | "compact";
  dark?: boolean;
}) {
  const href = `/insights/${insight.slug}`;
  const date = formatInsightDate(insight.publishedAt);

  if (variant === "compact") {
    return (
      <Link href={href} className="group flex gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-mist">
          {insight.coverImage && (
            <Image
              src={resolveImageUrl(insight.coverImage)}
              alt=""
              fill
              sizes="112px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
        <div className="min-w-0">
          <span className={cn("text-[11px] font-semibold uppercase tracking-wider", dark ? "text-teal-light" : "text-teal")}>
            {insight.category}
          </span>
          <h3
            className={cn(
              "mt-1 line-clamp-2 text-[15px] font-semibold leading-snug transition-colors",
              dark ? "text-white group-hover:text-teal-light" : "text-navy-deeper group-hover:text-navy"
            )}
          >
            {insight.title}
          </h3>
          {date && <span className={cn("mt-1 block text-xs", dark ? "text-white/45" : "text-ink/45")}>{date}</span>}
        </div>
      </Link>
    );
  }

  const featured = variant === "featured";

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-xl",
        dark ? "border-white/10 bg-white/[0.04] hover:shadow-black/30" : "border-black/[0.07] bg-white hover:shadow-navy-deeper/10"
      )}
    >
      <div className={cn("relative w-full overflow-hidden bg-mist", featured ? "aspect-[16/9]" : "aspect-[16/10]")}>
        {insight.coverImage && (
          <Image
            src={resolveImageUrl(insight.coverImage)}
            alt={insight.title}
            fill
            sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-navy-deeper/80 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {insight.category}
        </span>
      </div>
      <div className={cn("flex flex-1 flex-col", featured ? "p-7" : "p-5")}>
        {date && <span className={cn("text-xs", dark ? "text-white/45" : "text-ink/45")}>{date}</span>}
        <h3
          className={cn(
            "mt-2 font-display font-medium leading-snug",
            featured ? "text-[24px] md:text-[28px]" : "line-clamp-2 text-[18px]",
            dark ? "text-white" : "text-navy-deeper"
          )}
        >
          {insight.title}
        </h3>
        {insight.excerpt && (
          <p
            className={cn(
              "mt-3 text-[14px] leading-relaxed",
              featured ? "line-clamp-3" : "line-clamp-2",
              dark ? "text-white/60" : "text-ink/60"
            )}
          >
            {insight.excerpt}
          </p>
        )}
        <span
          className={cn(
            "mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold transition-all group-hover:gap-2.5",
            dark ? "text-teal-light" : "text-navy"
          )}
        >
          Read insight <span aria-hidden>&rarr;</span>
        </span>
      </div>
    </Link>
  );
}
