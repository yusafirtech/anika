export type SectorStory = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
};

export const sectorStories: SectorStory[] = [
  {
    id: "international-trade",
    eyebrow: "01 / INTERNATIONAL TRADE",
    title: "Connecting Quality Supply with Global Demand",
    description:
      "Moving products from Bangladesh into international markets takes more than a good product — it takes reliability, consistent quality and a partner who understands both sides of the trade.",
    image: "/images/story-international-trade.jpg",
  },
  {
    id: "seafood",
    eyebrow: "02 / SEAFOOD",
    title: "Reliable Seafood Supply Requires More Than a Product",
    description:
      "From sourcing to processing to export-ready packaging, seafood supply depends on consistency at every stage — cold chain discipline, quality control and the capacity to deliver at scale.",
    image: "/images/story-seafood.jpg",
  },
  {
    id: "vegetables",
    eyebrow: "03 / VEGETABLES & AGRICULTURE",
    title: "From Local Production to International Opportunity",
    description:
      "Fresh vegetables and agricultural produce carry real export potential when sourcing, grading, packaging and logistics are handled with the same discipline as any other traded commodity.",
    image: "/images/story-vegetable-market.jpg",
  },
  {
    id: "construction",
    eyebrow: "04 / CONSTRUCTION",
    title: "Projects Demand Capability, Coordination and Execution",
    description:
      "Construction and infrastructure work is won or lost on coordination — materials, manpower, timelines and site execution all have to move together.",
    image: "/images/story-construction-site.jpg",
  },
  {
    id: "government-supply",
    eyebrow: "05 / GOVERNMENT & INSTITUTIONAL SUPPLY",
    title: "Supporting Large-Scale Institutional Requirements",
    description:
      "Government and institutional procurement calls for a supplier who can meet specification, scale and process requirements — and follow through on delivery.",
    image: "/images/story-institutional-supply.jpg",
  },
];

export type BusinessShowcaseItem = {
  id: string;
  index: string;
  title: string;
  description: string;
  points: string[];
  cta: string;
  href: string;
  image: string;
};

export const businessShowcase: BusinessShowcaseItem[] = [
  {
    id: "export",
    index: "01",
    title: "Export & International Trade",
    description:
      "Bangladesh-origin seafood and agricultural products, prepared and packaged for international buyers looking for a dependable B2B supply partner.",
    points: ["Seafood & agricultural exports", "Bangladesh-origin sourcing", "B2B buyer relationships"],
    cta: "Explore Export",
    href: "/export",
    image: "/images/story-global-connection.jpg",
  },
  {
    id: "seafood-supply",
    index: "02",
    title: "Seafood Supply",
    description:
      "End-to-end seafood supply built around quality control, cold chain handling and export-ready packaging for both local and international buyers.",
    points: ["Sourcing & processing", "Cold chain handling", "Export-ready packaging"],
    cta: "View Seafood Supply",
    href: "/business",
    image: "/images/story-seafood-closeup.jpg",
  },
  {
    id: "vegetables-agri",
    index: "03",
    title: "Vegetable & Agricultural Products",
    description:
      "Sourcing and supplying fresh vegetables and agricultural produce, with the grading and packaging discipline international markets expect.",
    points: ["Fresh produce sourcing", "Grading & packaging", "Market-ready supply"],
    cta: "View Agricultural Supply",
    href: "/business",
    image: "/images/story-agriculture-origin.jpg",
  },
  {
    id: "construction",
    index: "04",
    title: "Construction & Projects",
    description:
      "Construction and project execution capability covering coordination, materials supply and on-site delivery from start to finish.",
    points: ["Project execution", "Materials coordination", "On-site delivery"],
    cta: "View Construction",
    href: "/business",
    image: "/images/materials-detail.jpg",
  },
  {
    id: "government-tender",
    index: "05",
    title: "Government Tender & Supply",
    description:
      "Participation in government and institutional tenders, with the supply infrastructure to meet procurement specifications and timelines.",
    points: ["Tender participation", "Institutional procurement", "Large-scale supply"],
    cta: "View Government Supply",
    href: "/business",
    image: "/images/story-institutional-supply.jpg",
  },
  {
    id: "trading-distribution",
    index: "06",
    title: "Trading & Distribution",
    description:
      "Import, trading and distribution operations that connect suppliers, products and buyers across Bangladesh's business network.",
    points: ["Import & trading", "Distribution network", "Business partnerships"],
    cta: "View Trading",
    href: "/business",
    image: "/images/story-business-network.jpg",
  },
];

export type HomeProject = {
  id: string;
  slug: string;
  name: string;
  category: string;
  location: string;
  status: string;
  description: string;
  image: string;
};

export const homeProjects: HomeProject[] = [
  {
    id: "infrastructure-environment",
    slug: "infrastructure-environment",
    name: "Infrastructure & Environment",
    category: "Construction",
    location: "Bangladesh",
    status: "In Progress",
    description:
      "Infrastructure-scale project work spanning site engineering, materials coordination and phased execution.",
    image: "/images/project-bridge.jpg",
  },
  {
    id: "building-construction",
    slug: "building-construction",
    name: "Building Construction",
    category: "Construction",
    location: "Bangladesh",
    status: "In Progress",
    description:
      "Ground-up building construction, coordinated across structural, material and manpower requirements.",
    image: "/images/project-building.jpg",
  },
  {
    id: "engineering-operations",
    slug: "engineering-operations",
    name: "Engineering Operations",
    category: "Construction",
    location: "Bangladesh",
    status: "Ongoing",
    description:
      "On-site engineering and operations management supporting active project delivery.",
    image: "/images/project-engineering.jpg",
  },
  {
    id: "materials-to-site",
    slug: "materials-to-site",
    name: "Materials to Site",
    category: "Supply",
    location: "Bangladesh",
    status: "Ongoing",
    description:
      "Materials sourcing and logistics, moving supply from origin to active project sites.",
    image: "/images/project-logistics.jpg",
  },
  {
    id: "industrial-capability",
    slug: "industrial-capability",
    name: "Industrial Capability",
    category: "Supply",
    location: "Bangladesh",
    status: "Ongoing",
    description:
      "Industrial-scale supply and coordination capability supporting institutional requirements.",
    image: "/images/project-industrial.jpg",
  },
];

export type WhyReason = {
  id: string;
  index: string;
  title: string;
  description: string;
  image: string;
};

export const whyReasons: WhyReason[] = [
  {
    id: "multi-sector",
    index: "01",
    title: "Multi-Sector Capability",
    description:
      "ANIKA operates across export, seafood, agricultural products, construction, supply and trading — one organization, several connected capabilities.",
    image: "/images/story-business-network.jpg",
  },
  {
    id: "supply-execution",
    index: "02",
    title: "Supply & Execution",
    description:
      "Capability extends beyond sourcing to supply, coordination and project execution, from first order to final delivery.",
    image: "/images/story-institutional-supply.jpg",
  },
  {
    id: "bangladesh-advantage",
    index: "03",
    title: "Bangladesh-Based Advantage",
    description:
      "Connecting international opportunities with Bangladesh-based products, suppliers and business capabilities.",
    image: "/images/story-agriculture-origin.jpg",
  },
  {
    id: "international-focus",
    index: "04",
    title: "International Business Focus",
    description:
      "Built to connect Bangladesh-origin products and capabilities with international buyers and partners.",
    image: "/images/story-global-connection.jpg",
  },
  {
    id: "partnership-mindset",
    index: "05",
    title: "Partnership Mindset",
    description:
      "A focus on long-term business relationships rather than one-off transactions, on every side of the business.",
    image: "/images/why-anika-collaboration.jpg",
  },
  {
    id: "one-business",
    index: "06",
    title: "One Connected Business",
    description:
      "Multiple business capabilities under one organization, coordinated rather than siloed.",
    image: "/images/story-infrastructure.jpg",
  },
];
