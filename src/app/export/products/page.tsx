import { redirect } from "next/navigation";

// The product listing now lives on /export (searchable, filterable catalog).
export default async function ExportProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") params.set(key, value);
  }
  const qs = params.toString();
  redirect(`/export${qs ? `?${qs}` : ""}#catalog`);
}
