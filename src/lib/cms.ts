// Server-side data access for content managed via the admin panel.
// Every page component fetches its content here, with the current hardcoded
// content in `src/data/*.ts` (or inline in components) kept as the fallback
// value so the site keeps rendering correctly even if the backend/database
// is unreachable or a page hasn't been saved from the admin panel yet.

import type { ExportPageContent, Insight } from "@/types/cms";
import { exportCategories, exportProcess, exportProducts } from "@/data/export";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN || API_URL.replace(/\/api\/?$/, "");

/** Public origin of this website, used for canonical URLs, the sitemap, and structured data. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.anikatradingco.com").replace(/\/$/, "");

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Fetches a named page's content (e.g. "home", "about"). Falls back on any failure. */
export async function getPageContent<T>(pageKey: string, fallback: T): Promise<T> {
  const data = await fetchJson<{ content: T }>(`/pages/${pageKey}`);
  return data?.content ?? fallback;
}

/** Fetches a named collection (e.g. "partners"). Falls back if empty/unreachable. */
export async function getCollectionItems<T>(key: string, fallback: T[]): Promise<T[]> {
  const data = await fetchJson<{ items: T[] }>(`/collections/${key}`);
  return data?.items && data.items.length > 0 ? data.items : fallback;
}

export const DEFAULT_EXPORT_CONTENT: ExportPageContent = {
  intro: {
    eyebrow: "International B2B",
    heading: "Export From Bangladesh",
    description: "Connecting Bangladesh-origin products with international buyers.",
  },
  categories: exportCategories,
  process: exportProcess,
  products: exportProducts,
};

export function getExportContent(): Promise<ExportPageContent> {
  return getPageContent<ExportPageContent>("export", DEFAULT_EXPORT_CONTENT);
}

/** Published insights, newest first (featured ones lead). */
export async function getInsights(
  params: { category?: string; product?: string; limit?: number } = {}
): Promise<Insight[]> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.product) query.set("product", params.product);
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  const data = await fetchJson<{ insights: Insight[] }>(`/insights${qs ? `?${qs}` : ""}`);
  return data?.insights ?? [];
}

export async function getInsight(slug: string): Promise<Insight | null> {
  const data = await fetchJson<{ insight: Insight }>(`/insights/${encodeURIComponent(slug)}`);
  return data?.insight ?? null;
}

/**
 * Resolves an image path coming from admin-managed content into a URL the
 * browser can load. Uploaded images are stored in MySQL and served by the
 * backend at a relative `/api/media/...` path, so those need the backend's
 * origin prepended; static defaults (`/images/...`) are already servable
 * from this app's own `public/` folder and are returned unchanged.
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/api/")) return `${API_ORIGIN}${url}`;
  return url;
}

/** Absolute URL for crawlers and link previews (OG images, JSON-LD). */
export function absoluteUrl(pathOrUrl: string | null | undefined): string {
  const resolved = resolveImageUrl(pathOrUrl);
  if (!resolved) return "";
  return resolved.startsWith("http") ? resolved : `${SITE_URL}${resolved.startsWith("/") ? "" : "/"}${resolved}`;
}

/** Serializes JSON-LD safely for a <script> tag (escapes `<` to prevent tag injection). */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
