import type { Metadata } from "next";
import ExportHero from "@/components/export/ExportHero";
import ExportCategories from "@/components/export/ExportCategories";
import ExportProcess from "@/components/export/ExportProcess";
import BuyerSection from "@/components/export/BuyerSection";

export const metadata: Metadata = {
  title: "Export From Bangladesh",
  description:
    "Connecting Bangladesh-origin seafood and agricultural products with international buyers.",
};

export default function ExportPage() {
  return (
    <>
      <ExportHero />
      <ExportCategories />
      <ExportProcess />
      <BuyerSection />
    </>
  );
}
