import type { Metadata } from "next";
import ExportCatalog from "@/components/export/ExportCatalog";
import ExportProcess from "@/components/export/ExportProcess";
import BuyerSection from "@/components/export/BuyerSection";
import { getExportContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Export Products From Bangladesh",
  description:
    "Browse Bangladesh-origin export products — frozen shrimp, seafood, fresh vegetables, and agricultural produce. Filter by category, check MOQ and specifications, and request a quote.",
  alternates: { canonical: "/export" },
  openGraph: {
    title: "Export Products From Bangladesh | ANIKA TRADING & CO.",
    description:
      "Bangladesh-origin seafood, vegetables, and agricultural products for international B2B buyers.",
    type: "website",
  },
};

export default async function ExportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [content, { q, category }] = await Promise.all([getExportContent(), searchParams]);

  const initialCategory =
    typeof category === "string" && content.products.some((p) => p.category === category) ? category : "All";

  return (
    <>
      <ExportCatalog
        intro={content.intro}
        categories={content.categories}
        products={content.products}
        initialQuery={typeof q === "string" ? q : ""}
        initialCategory={initialCategory}
      />
      <ExportProcess process={content.process} />
      <BuyerSection />
    </>
  );
}
