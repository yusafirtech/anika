import type { Metadata } from "next";
import ExportHero from "@/components/export/ExportHero";
import ExportCategories from "@/components/export/ExportCategories";
import ExportProcess from "@/components/export/ExportProcess";
import BuyerSection from "@/components/export/BuyerSection";
import { getPageContent } from "@/lib/cms";
import type { ExportPageContent } from "@/types/cms";
import { exportCategories, exportProcess, exportProducts } from "@/data/export";

export const metadata: Metadata = {
  title: "Export From Bangladesh",
  description:
    "Connecting Bangladesh-origin seafood and agricultural products with international buyers.",
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

export default async function ExportPage() {
  const content = await getPageContent<ExportPageContent>("export", DEFAULT_EXPORT_CONTENT);

  return (
    <>
      <ExportHero {...content.intro} />
      <ExportCategories categories={content.categories} />
      <ExportProcess process={content.process} />
      <BuyerSection />
    </>
  );
}
