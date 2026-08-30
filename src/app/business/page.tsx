import type { Metadata } from "next";
import PageIntro from "@/components/ui/PageIntro";
import BusinessNav from "@/components/business/BusinessNav";
import BusinessDetail from "@/components/business/BusinessDetail";
import { businessVerticals } from "@/data/business";

export const metadata: Metadata = {
  title: "Our Business",
  description:
    "Multiple capabilities, one connected business — construction, government supply, distribution, trading and export.",
};

export default function BusinessPage() {
  return (
    <>
      <div className="bg-navy-deeper">
        <PageIntro
          eyebrow="Our Business"
          title="Multiple Capabilities. One Connected Business."
          description="ANIKA operates across construction, government and private supply, distribution, trading and export — six capabilities that work together rather than in isolation."
          dark
        />
      </div>
      <BusinessNav />
      {businessVerticals.map((v, i) => (
        <BusinessDetail key={v.id} vertical={v} index={i} />
      ))}
    </>
  );
}
