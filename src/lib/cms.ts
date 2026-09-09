// Server-side data access for content managed via the admin panel.
// Every page component fetches its content here, with the current hardcoded
// content in `src/data/*.ts` (or inline in components) kept as the fallback
// value so the site keeps rendering correctly even if the backend/database
// is unreachable or a page hasn't been saved from the admin panel yet.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN || API_URL.replace(/\/api\/?$/, "");

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

/** Fetches a named collection (e.g. "hero"). Falls back if empty/unreachable. */
export async function getCollectionItems<T>(key: string, fallback: T[]): Promise<T[]> {
  const data = await fetchJson<{ items: T[] }>(`/collections/${key}`);
  return data?.items && data.items.length > 0 ? data.items : fallback;
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
