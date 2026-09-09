import type { Metadata } from "next";
import PageIntro from "@/components/ui/PageIntro";
import ProductCatalogue from "@/components/export/ProductCatalogue";
import { getPageContent } from "@/lib/cms";
import type { ExportPageContent } from "@/types/cms";
import { exportCategories, exportProcess, exportProducts } from "@/data/export";

export const metadata: Metadata = {
  title: "Export Products",
  description: "Browse Bangladesh-origin export products and request a quote.",
};

const DEFAULT_EXPORT_CONTENT: ExportPageContent = {
  intro: {
    eyebrow: "International B2B",
    heading: "Export From Bangladesh",
    description: "Connecting Bangladesh-origin products with international buyers.",
  },
  categories: exportCategories,
  process: exportProcess,
  products: exportProducts,
};

export default async function ExportProductsPage() {
  const content = await getPageContent<ExportPageContent>("export", DEFAULT_EXPORT_CONTENT);

  return (
    <>
      <PageIntro
        eyebrow="B2B Catalogue"
        title="Export Products"
        description="Browse products by category, check specifications, and send a quote request — no accounts, no checkout, just a direct line to ANIKA."
      />
      <ProductCatalogue products={content.products} />
    </>
  );
}
