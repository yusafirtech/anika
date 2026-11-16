export const timelineStages = [
  {
    id: "origin",
    label: "ORIGIN",
    title: "A Bangladesh-Based Business Company",
    description:
      "ANIKA began as a Bangladesh-based business company, built to operate across more than one sector rather than specialize narrowly in one.",
    image: "/images/materials-detail.jpg",
  },
  {
    id: "construction",
    label: "CONSTRUCTION",
    title: "Building Project Execution Capability",
    description:
      "Construction and project work established the company's discipline around coordination, materials and on-site delivery.",
    image: "/images/story-construction-site.jpg",
  },
  {
    id: "supply",
    label: "SUPPLY",
    title: "Extending into Government & Institutional Supply",
    description:
      "That execution capability extended naturally into government and institutional supply, where scale and specification matter as much as delivery.",
    image: "/images/story-institutional-supply.jpg",
  },
  {
    id: "distribution",
    label: "DISTRIBUTION",
    title: "Building a Distribution Network",
    description:
      "Distribution and private-sector supply work grew the company's network of business relationships across Bangladesh.",
    image: "/images/story-business-network.jpg",
  },
  {
    id: "trading",
    label: "TRADING",
    title: "Import & Trading Operations",
    description:
      "Import and trading operations connected ANIKA to a wider set of suppliers, products and business partners.",
    image: "/images/trade-detail.jpg",
  },
  {
    id: "export",
    label: "EXPORT",
    title: "Reaching International Markets",
    description:
      "Today, that same foundation supports international export — connecting Bangladesh-origin products with buyers abroad.",
    image: "/images/story-international-trade.jpg",
  },
];

export const coreValues = [
  { id: "integrity", label: "INTEGRITY", description: "Doing business honestly, even when no one is checking." },
  { id: "reliability", label: "RELIABILITY", description: "Being the partner who delivers what was promised." },
  { id: "quality", label: "QUALITY", description: "Holding products and execution to a consistent standard." },
  { id: "professionalism", label: "PROFESSIONALISM", description: "Operating with the discipline serious business requires." },
  { id: "partnership", label: "PARTNERSHIP", description: "Building relationships that outlast a single transaction." },
  { id: "growth", label: "GROWTH", description: "Growing capability deliberately, sector by sector." },
];

// Shared fallback for AboutPageContent — used by both /about and
// /about/mission-vision so the two pages agree on a single source when the
// backend/database is unreachable or the page hasn't been saved yet.
export const DEFAULT_ABOUT_CONTENT = {
  intro: {
    eyebrow: "About ANIKA",
    heading: "A Diversified Business Company Built Around Opportunity.",
    leadText:
      "ANIKA TRADING & CO. is a Bangladesh-based diversified business company involved in construction, government projects, government and private supply, distribution, import and trading, and international export. Rather than specializing in a single sector, ANIKA is built to move across several connected ones.",
    bodyText: "",
    image: "/images/story-agriculture-origin.jpg",
    images: [] as string[],
    stats: [] as { value: string; label: string }[],
  },
  timeline: timelineStages,
  missionVision: {
    missionTitle: "Our Mission",
    missionText:
      "To deliver reliable construction, supply, distribution and trading solutions while building long-term relationships with clients, partners and international buyers.",
    visionTitle: "Our Vision",
    visionText:
      "To grow as a trusted and internationally connected Bangladesh-based business company, creating sustainable opportunities across construction, supply, distribution and global trade.",
    pillars: [] as string[],
  },
  coreValues,
  philosophy: {
    quote: "",
    narrative: "",
    authorName: "",
    authorTitle: "",
    image: "/images/trade-detail.jpg",
    images: [] as string[],
  },
  gallery: {
    eyebrow: "In the Field",
    heading: "Our Work, On Site and On the Record",
    description:
      "A look across our construction sites, supply operations and export facilities — the day-to-day work behind the company.",
    images: [] as { id: string; image: string; caption?: string }[],
  },
};
