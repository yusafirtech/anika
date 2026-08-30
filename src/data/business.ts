export type BusinessVertical = {
  id: string;
  index: string;
  title: string;
  eyebrow: string;
  description: string;
  capabilities: string[];
  cta: string;
  image: string;
  layout: "side" | "banner" | "reverse";
};

export const businessVerticals: BusinessVertical[] = [
  {
    id: "construction",
    index: "01",
    title: "Construction & Projects",
    eyebrow: "Capability",
    description:
      "Construction and project work covering coordination, materials and on-site execution — from planning through to delivery.",
    capabilities: ["Project execution", "Site coordination", "Materials supply", "Infrastructure work"],
    cta: "Discuss a Project",
    image: "/images/story-construction-site.jpg",
    layout: "side",
  },
  {
    id: "government-supply",
    index: "02",
    title: "Government Supply",
    eyebrow: "Procurement",
    description:
      "Participation in government supply and tender processes, with the infrastructure to meet institutional specifications and timelines.",
    capabilities: ["Tender participation", "Institutional procurement", "Specification compliance", "Large-scale supply"],
    cta: "Send Supply Requirement",
    image: "/images/story-institutional-supply.jpg",
    layout: "reverse",
  },
  {
    id: "private-supply",
    index: "03",
    title: "Private Supply & Distribution",
    eyebrow: "Distribution",
    description:
      "Bulk supply and distribution for private-sector requirements, connecting suppliers and buyers through a coordinated business-to-business network.",
    capabilities: ["Bulk supply", "Distribution network", "B2B fulfilment"],
    cta: "Request Business Inquiry",
    image: "/images/story-business-network.jpg",
    layout: "banner",
  },
  {
    id: "trading",
    index: "04",
    title: "Import & Trading",
    eyebrow: "Trading",
    description:
      "Sourcing, trading and supply networks that facilitate business across a wider set of products and partners.",
    capabilities: ["Sourcing", "Import & trading", "Supply networks"],
    cta: "Discuss Trading",
    image: "/images/trade-detail.jpg",
    layout: "side",
  },
  {
    id: "export",
    index: "05",
    title: "Export",
    eyebrow: "International",
    description:
      "Bangladesh-origin products — seafood, vegetables and agricultural produce — prepared and exported for international buyers.",
    capabilities: ["Seafood & agricultural exports", "Export packaging", "International buyer relationships"],
    cta: "Explore Export Products",
    image: "/images/story-seafood-closeup.jpg",
    layout: "reverse",
  },
  {
    id: "international-business",
    index: "06",
    title: "International Business",
    eyebrow: "Partnerships",
    description:
      "Cross-border business relationships built around international buyers, partnerships and export opportunities.",
    capabilities: ["International partnerships", "Cross-border business", "Buyer development"],
    cta: "Become a Buyer",
    image: "/images/story-global-connection.jpg",
    layout: "side",
  },
];
