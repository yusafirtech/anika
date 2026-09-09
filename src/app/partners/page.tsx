import type { Metadata } from "next";
import PageIntro from "@/components/ui/PageIntro";
import PartnersGrid from "@/components/partners/PartnersGrid";
import { getCollectionItems } from "@/lib/cms";
import type { PartnerItem } from "@/types/cms";
import { partners } from "@/data/partners";

export const metadata: Metadata = {
  title: "Our Partners",
  description:
    "The international buyers, suppliers, logistics carriers, and institutional partners ANIKA TRADING & CO. works with.",
};

export default async function PartnersPage() {
  const content = await getCollectionItems<PartnerItem>("partners", partners);

  return (
    <>
      <PageIntro
        eyebrow="Global Network"
        title="The Partners We Work With."
        description="Verified international buyers, suppliers, logistics carriers, and institutional partners connected to ANIKA's supply and export operations."
      />
      <PartnersGrid partners={content} />
    </>
  );
}
