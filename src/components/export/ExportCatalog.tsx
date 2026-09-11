"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CatalogProductCard, { isCertified } from "@/components/export/CatalogProductCard";
import { resolveImageUrl } from "@/lib/cms";
import { cn } from "@/lib/utils";
import type { ExportPageContent, ExportProduct } from "@/types/cms";

type SortKey = "recommended" | "name-asc" | "name-desc";
type ViewMode = "grid" | "list";

const ALL = "All";

function normalize(value: string) {
  return value.toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
}

function matchesQuery(product: ExportProduct, query: string) {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return true;
  const haystack = normalize(
    [
      product.name,
      product.summary,
      product.category,
      product.origin,
      product.availability,
      product.moq,
      ...(product.specifications || []).flatMap((s) => [s.label, s.value]),
      ...(product.certifications || []).map((c) => c.title),
    ].join(" ")
  );
  return tokens.every((t) => haystack.includes(t));
}

export default function ExportCatalog({
  intro,
  categories: cmsCategories,
  products,
  initialQuery = "",
  initialCategory = ALL,
}: {
  intro: ExportPageContent["intro"];
  categories: ExportPageContent["categories"];
  products: ExportProduct[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [availability, setAvailability] = useState<string[]>([]);
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [view, setView] = useState<ViewMode>("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Category tiles come from the products themselves (so a filter always has
  // results), using the admin's category image when a label lines up.
  const categoryTiles = useMemo(() => {
    const labels = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return labels.map((label) => {
      const key = normalize(label);
      const cmsMatch = cmsCategories.find((c) => {
        const cmsKey = normalize(c.label);
        return cmsKey === key || cmsKey.includes(key) || key.includes(cmsKey);
      });
      const firstProduct = products.find((p) => p.category === label);
      return {
        label,
        image: cmsMatch?.image || firstProduct?.image || "",
        count: products.filter((p) => p.category === label).length,
      };
    });
  }, [products, cmsCategories]);

  const availabilityOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.availability).filter(Boolean))),
    [products]
  );
  const certifiedCount = products.filter(isCertified).length;

  const filtered = useMemo(() => {
    const list = products.filter(
      (p) =>
        (category === ALL || p.category === category) &&
        (availability.length === 0 || availability.includes(p.availability)) &&
        (!certifiedOnly || isCertified(p)) &&
        matchesQuery(p, query)
    );
    if (sort === "name-asc") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") return [...list].sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [products, category, availability, certifiedOnly, query, sort]);

  // Keep the URL shareable (?q=&category=) without a server round-trip.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    if (category !== ALL) params.set("category", category);
    else params.delete("category");
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
  }, [query, category]);

  const activeFilterCount = (category !== ALL ? 1 : 0) + availability.length + (certifiedOnly ? 1 : 0);

  const clearAll = () => {
    setQuery("");
    setCategory(ALL);
    setAvailability([]);
    setCertifiedOnly(false);
  };

  const toggleAvailability = (value: string) =>
    setAvailability((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const scrollToCatalog = () => document.getElementById("catalog")?.scrollIntoView({ block: "start" });

  const filterPanel = (
    <div className="space-y-7">
      <div>
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.15em] text-ink/50">Category</h3>
        <ul className="mt-3 space-y-0.5">
          {[{ label: ALL, count: products.length }, ...categoryTiles].map((c) => (
            <li key={c.label}>
              <button
                type="button"
                onClick={() => setCategory(c.label)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  category === c.label ? "bg-navy text-white" : "text-ink/70 hover:bg-mist"
                )}
              >
                <span className="truncate">{c.label === ALL ? "All products" : c.label}</span>
                <span className={cn("ml-3 text-xs", category === c.label ? "text-white/70" : "text-ink/40")}>
                  {c.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {availabilityOptions.length > 1 && (
        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.15em] text-ink/50">Availability</h3>
          <div className="mt-3 space-y-2">
            {availabilityOptions.map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={availability.includes(opt)}
                  onChange={() => toggleAvailability(opt)}
                  className="h-4 w-4 rounded border-black/20 accent-navy"
                />
                {opt}
                <span className="ml-auto text-xs text-ink/40">
                  {products.filter((p) => p.availability === opt).length}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {certifiedCount > 0 && (
        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.15em] text-ink/50">Quality</h3>
          <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={certifiedOnly}
              onChange={(e) => setCertifiedOnly(e.target.checked)}
              className="h-4 w-4 rounded border-black/20 accent-navy"
            />
            Certified products only
            <span className="ml-auto text-xs text-ink/40">{certifiedCount}</span>
          </label>
        </div>
      )}

      {(activeFilterCount > 0 || query) && (
        <button type="button" onClick={clearAll} className="text-sm font-semibold text-navy hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Search hero */}
      <section className="relative overflow-hidden bg-navy-deeper pb-12 pt-32 md:pb-16 md:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-teal/20 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">{intro.eyebrow}</p>
          <h1 className="mt-4 font-display text-[34px] font-medium leading-[1.08] text-white md:text-[52px]">
            {intro.heading}
          </h1>
          {intro.description && (
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-base">
              {intro.description}
            </p>
          )}

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              scrollToCatalog();
            }}
            className="mx-auto mt-8 flex max-w-3xl items-stretch overflow-hidden rounded-full bg-white p-1.5 shadow-2xl shadow-black/30"
          >
            <label className="sr-only" htmlFor="catalog-category">
              Category
            </label>
            <select
              id="catalog-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="hidden max-w-[11rem] shrink-0 cursor-pointer rounded-l-full border-r border-black/10 bg-transparent pl-5 pr-3 text-sm font-medium text-ink/70 outline-none sm:block"
            >
              <option value={ALL}>All categories</option>
              {categoryTiles.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="catalog-search">
              Search products
            </label>
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shrimp, frozen fish, vegetables..."
              className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-ink outline-none placeholder:text-ink/40 sm:px-5"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-2 rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-light hover:text-navy-deeper sm:px-7"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          <dl className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            {[
              { value: products.length, label: products.length === 1 ? "Product" : "Products" },
              { value: categoryTiles.length, label: categoryTiles.length === 1 ? "Category" : "Categories" },
              ...(certifiedCount > 0 ? [{ value: certifiedCount, label: "Certified" }] : []),
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-xl font-semibold text-white">{s.value}</dd>
                <span className="text-white/50">{s.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-light" />
              Bangladesh origin
            </div>
          </dl>
        </div>
      </section>

      {/* Category rail */}
      <section id="categories" className="scroll-mt-20 border-b border-black/[0.06] bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="-mx-2 flex gap-2 overflow-x-auto px-2 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setCategory(ALL)}
              className={cn(
                "group flex w-28 shrink-0 flex-col items-center gap-2.5 rounded-2xl px-2 py-3 transition-colors",
                category === ALL ? "bg-navy/[0.06]" : "hover:bg-mist"
              )}
            >
              <span
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-full border-2 bg-mist transition-colors",
                  category === ALL ? "border-navy text-navy" : "border-transparent text-ink/50"
                )}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </span>
              <span className={cn("text-center text-[12.5px] font-medium leading-tight", category === ALL ? "text-navy" : "text-ink/70")}>
                All products
              </span>
            </button>

            {categoryTiles.map((c) => {
              const active = category === c.label;
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setCategory(active ? ALL : c.label)}
                  className={cn(
                    "group flex w-28 shrink-0 flex-col items-center gap-2.5 rounded-2xl px-2 py-3 transition-colors",
                    active ? "bg-navy/[0.06]" : "hover:bg-mist"
                  )}
                >
                  <span
                    className={cn(
                      "relative h-16 w-16 overflow-hidden rounded-full border-2 bg-mist transition-colors",
                      active ? "border-navy" : "border-transparent"
                    )}
                  >
                    {c.image && (
                      <Image
                        src={resolveImageUrl(c.image)}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                  </span>
                  <span className={cn("text-center text-[12.5px] font-medium leading-tight", active ? "text-navy" : "text-ink/70")}>
                    {c.label}
                    <span className="block text-[11px] font-normal text-ink/40">{c.count} items</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="scroll-mt-20 bg-paper py-10 md:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:px-8 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/[0.07] bg-white p-5">{filterPanel}</div>
          </aside>

          <div className="min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium text-ink/75 lg:hidden"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" d="M4 6h16M7 12h10M10 18h4" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-navy px-1.5 text-[11px] font-semibold text-white">{activeFilterCount}</span>
                )}
              </button>

              <p className="text-sm text-ink/60">
                <span className="font-semibold text-navy-deeper">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "product" : "products"}
                {category !== ALL && (
                  <>
                    {" "}
                    in <span className="font-semibold text-navy-deeper">{category}</span>
                  </>
                )}
                {query.trim() && (
                  <>
                    {" "}
                    for &ldquo;<span className="font-semibold text-navy-deeper">{query.trim()}</span>&rdquo;
                  </>
                )}
              </p>

              <div className="ml-auto flex items-center gap-2">
                <label className="sr-only" htmlFor="catalog-sort">
                  Sort by
                </label>
                <select
                  id="catalog-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="cursor-pointer rounded-full border border-black/15 bg-white px-4 py-2 text-sm text-ink/75 outline-none focus:border-navy/40"
                >
                  <option value="recommended">Recommended</option>
                  <option value="name-asc">Name: A–Z</option>
                  <option value="name-desc">Name: Z–A</option>
                </select>
                <div className="hidden overflow-hidden rounded-full border border-black/15 bg-white sm:flex" role="group" aria-label="View">
                  {(["grid", "list"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setView(mode)}
                      aria-pressed={view === mode}
                      aria-label={mode === "grid" ? "Grid view" : "List view"}
                      className={cn("px-3 py-2 transition-colors", view === mode ? "bg-navy text-white" : "text-ink/50 hover:text-navy")}
                    >
                      {mode === "grid" ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <rect x="3" y="3" width="8" height="8" rx="1.5" />
                          <rect x="13" y="3" width="8" height="8" rx="1.5" />
                          <rect x="3" y="13" width="8" height="8" rx="1.5" />
                          <rect x="13" y="13" width="8" height="8" rx="1.5" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <rect x="3" y="4" width="18" height="4" rx="1.5" />
                          <rect x="3" y="10" width="18" height="4" rx="1.5" />
                          <rect x="3" y="16" width="18" height="4" rx="1.5" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {category !== ALL && <FilterChip label={category} onRemove={() => setCategory(ALL)} />}
                {availability.map((a) => (
                  <FilterChip key={a} label={a} onRemove={() => toggleAvailability(a)} />
                ))}
                {certifiedOnly && <FilterChip label="Certified only" onRemove={() => setCertifiedOnly(false)} />}
              </div>
            )}

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
                <p className="font-display text-xl text-navy-deeper">No products match your search</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-ink/55">
                  Try a different keyword or clear the filters. We also source products on request.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy/5"
                  >
                    Clear filters
                  </button>
                  <Link href="/contact" className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deeper">
                    Send a sourcing request
                  </Link>
                </div>
              </div>
            ) : view === "grid" ? (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => (
                  <CatalogProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {filtered.map((product) => (
                  <CatalogProductCard key={product.slug} product={product} view="list" />
                ))}
              </div>
            )}

            {/* Sourcing request */}
            <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl bg-navy-deeper p-7 md:flex-row md:items-center md:p-9">
              <div>
                <h2 className="font-display text-[22px] font-medium text-white md:text-[26px]">
                  Can&rsquo;t find exactly what you need?
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/60">
                  Tell us the product, grade, quantity, and destination — our export desk will source it and send a
                  quotation.
                </p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 rounded-full bg-white px-6 py-3 text-[13px] font-semibold tracking-wide text-navy-deeper transition-transform hover:scale-[1.03]"
              >
                SEND SOURCING REQUEST
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-navy-deeper/50 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-medium text-navy-deeper">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="rounded-full p-2 text-ink/50 hover:bg-mist"
                aria-label="Close filters"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-7 w-full rounded-full bg-navy py-3.5 text-sm font-semibold text-white"
            >
              Show {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/[0.07] py-1 pl-3 pr-1.5 text-[13px] font-medium text-navy">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="rounded-full p-0.5 hover:bg-navy/10"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
