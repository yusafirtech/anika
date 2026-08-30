import type { Metadata } from "next";
import PageIntro from "@/components/ui/PageIntro";
import ProductCatalogue from "@/components/export/ProductCatalogue";

export const metadata: Metadata = {
  title: "Export Products",
  description: "Browse Bangladesh-origin export products and request a quote.",
};

export default function ExportProductsPage() {
  return (
    <>
      <PageIntro
        eyebrow="B2B Catalogue"
        title="Export Products"
        description="Browse products by category, check specifications, and send a quote request — no accounts, no checkout, just a direct line to ANIKA."
      />
      <ProductCatalogue />
    </>
  );
}
