import type { Metadata } from "next";
import PageIntro from "@/components/ui/PageIntro";
import PartnersGrid from "@/components/partners/PartnersGrid";
import { getCollectionItems } from "@/lib/cms";
import type { PartnerItem } from "@/types/cms";
import { partners } from "@/data/partners";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export const metadata: Metadata = {
  title: "Our Partners",
  description:
    "The international buyers, suppliers, logistics carriers, and institutional partners ANIKA TRADING & CO. works with.",
};

export default async function PartnersPage() {
  const [content, locale] = await Promise.all([
    getCollectionItems<PartnerItem>("partners", partners),
    getLocale(),
  ]);
  const dict = getDictionary(locale).partnersExtra;

  return (
    <>
      <PageIntro eyebrow={dict.eyebrow} title={dict.heading} description={dict.description} />
      <PartnersGrid partners={content} dict={dict} />
    </>
  );
}
