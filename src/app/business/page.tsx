import type { Metadata } from "next";
import PageIntro from "@/components/ui/PageIntro";
import BusinessNav from "@/components/business/BusinessNav";
import BusinessDetail from "@/components/business/BusinessDetail";
import { getPageContent } from "@/lib/cms";
import type { BusinessPageContent } from "@/types/cms";
import { businessVerticals } from "@/data/business";

export const metadata: Metadata = {
  title: "Our Business",
  description:
    "Multiple capabilities, one connected business — construction, government supply, distribution, trading and export.",
};

const DEFAULT_BUSINESS_CONTENT: BusinessPageContent = {
  intro: {
    eyebrow: "Our Business",
    heading: "Multiple Capabilities. One Connected Business.",
    description:
      "ANIKA operates across construction, government and private supply, distribution, trading and export — six capabilities that work together rather than in isolation.",
  },
  verticals: businessVerticals,
};

export default async function BusinessPage() {
  const content = await getPageContent<BusinessPageContent>("business", DEFAULT_BUSINESS_CONTENT);

  return (
    <>
      <div className="bg-navy-deeper">
        <PageIntro
          eyebrow={content.intro.eyebrow}
          title={content.intro.heading}
          description={content.intro.description}
          dark
        />
      </div>
      <BusinessNav businessVerticals={content.verticals} />
      {content.verticals.map((v, i) => (
        <BusinessDetail key={v.id} vertical={v} index={i} />
      ))}
    </>
  );
}
