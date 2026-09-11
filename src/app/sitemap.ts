import type { MetadataRoute } from "next";
import { SITE_URL, getExportContent, getInsights, getPageContent } from "@/lib/cms";
import { projects as defaultProjects } from "@/data/projects";
import type { ProjectsPageContent } from "@/types/cms";

// Always reflect the latest products and insights published from the admin panel.
export const dynamic = "force-dynamic";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/export", priority: 0.95, changeFrequency: "daily" },
  { path: "/insights", priority: 0.8, changeFrequency: "daily" },
  { path: "/business", priority: 0.7, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/partners", priority: 0.5, changeFrequency: "monthly" },
  { path: "/team", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
];

function toDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [exportContent, insights, projectsContent] = await Promise.all([
    getExportContent(),
    getInsights(),
    getPageContent<ProjectsPageContent>("projects", {
      intro: { eyebrow: "", heading: "", description: "" },
      projects: defaultProjects,
    }),
  ]);
  const now = new Date();

  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...exportContent.products
      .filter((p) => !p.seo?.noIndex)
      .map((p) => ({
        url: `${SITE_URL}/export/products/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      })),
    ...insights.map((i) => ({
      url: `${SITE_URL}/insights/${i.slug}`,
      lastModified: toDate(i.updatedAt) || toDate(i.publishedAt) || now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...projectsContent.projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
