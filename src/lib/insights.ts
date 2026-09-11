export type ContentBlock =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "ul"; items: string[] };

/**
 * Parses the lightweight article format used in the admin editor:
 * blank line = new block, "## " = subheading, "### " = minor heading,
 * lines starting with "- " = bullet list. Everything renders as text nodes,
 * so no HTML from the database ever reaches the page.
 */
export function parseContent(content: string): ContentBlock[] {
  return content
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block): ContentBlock => {
      if (block.startsWith("### ")) return { type: "h3", text: block.slice(4).trim() };
      if (block.startsWith("## ")) return { type: "h2", text: block.slice(3).trim() };
      const lines = block.split("\n").map((l) => l.trim());
      if (lines.every((l) => l.startsWith("- "))) {
        return { type: "ul", items: lines.map((l) => l.slice(2).trim()) };
      }
      return { type: "p", text: lines.join(" ") };
    });
}

/** Formats a MySQL "YYYY-MM-DD HH:MM:SS" string by its calendar date, without timezone drift. */
export function formatInsightDate(value: string | null | undefined): string {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function toIsoDate(value: string | null | undefined): string | undefined {
  return value ? value.replace(" ", "T") : undefined;
}

export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
