"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { exportProducts } from "@/data/export";
import { cn } from "@/lib/utils";

const categories = ["All", ...Array.from(new Set(exportProducts.map((p) => p.category)))];

export default function ProductCatalogue() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return exportProducts.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <section className="bg-paper pb-28 pt-8">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
          {/* Filters */}
          <aside className="md:sticky md:top-28 md:self-start">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search export products..."
              className="w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-navy/40"
            />
            <div className="mt-6 flex flex-row flex-wrap gap-2 md:flex-col md:gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "rounded-full px-4 py-2 text-left text-[13px] font-medium transition-colors md:rounded-lg",
                    category === cat
                      ? "bg-navy text-white"
                      : "bg-black/5 text-ink/60 hover:bg-black/10 md:bg-transparent md:hover:bg-black/5"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {filtered.map((product) => (
              <Link
                key={product.slug}
                href={`/export/products/${product.slug}`}
                className="group"
              >
                <div className="relative h-[32vh] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 768px) 32vw, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-navy-deeper/70 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-navy-deeper">
                  {product.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{product.summary}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-ink/40">
                    {product.origin} &middot; {product.availability}
                  </span>
                  <span className="text-sm font-semibold text-navy">Request Quote &rarr;</span>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-2 py-10 text-center text-sm text-ink/40">
                No products match your search.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
