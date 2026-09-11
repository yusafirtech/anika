export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 180);
}

/** Public website origin, for "Live Preview" links and search-result previews. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '');

export function siteLink(path: string): string {
  return `${SITE_URL}${path}`;
}
