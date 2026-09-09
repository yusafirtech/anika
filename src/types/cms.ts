// Content shapes saved by the admin panel (backend `pages_content` table).
// These mirror admin/src/types.ts's Page Content interfaces exactly, since
// that is what the admin panel writes and what GET /api/pages/:pageKey returns.

// Mirrors admin/src/types.ts's PartnerItem — this is a `content_collections`
// entry (GET /api/collections/partners), not a page-content document.
export interface PartnerItem {
  id: string;
  name: string;
  category: "Buyer" | "Supplier" | "Logistics Partner" | "Institutional";
  country: string;
  logo: string;
  status: "Active" | "Pending";
  partnershipYear: number;
}

export interface HomePageContent {
  hero: {
    eyebrow: string;
    headlineWords: string[];
    subtitle: string;
    bgImage: string;
    ctaText: string;
    ctaLink: string;
    keywords: string[];
  };
  sectorStories: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    image: string;
  }[];
  businessShowcase: {
    id: string;
    index: string;
    title: string;
    description: string;
    points: string[];
    cta: string;
    href: string;
    image: string;
  }[];
  whyReasons: {
    id: string;
    index: string;
    title: string;
    description: string;
    image: string;
  }[];
  cta: {
    eyebrow: string;
    heading: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    bgImage: string;
  };
}

export interface AboutPageContent {
  intro: {
    eyebrow: string;
    heading: string;
    leadText: string;
    bodyText: string;
    image: string;
    stats: { value: string; label: string }[];
  };
  timeline: {
    id: string;
    label: string;
    title: string;
    description: string;
    image: string;
  }[];
  missionVision: {
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
    pillars: string[];
  };
  coreValues: {
    id: string;
    label: string;
    description: string;
  }[];
  philosophy: {
    quote: string;
    narrative: string;
    authorName: string;
    authorTitle: string;
    image: string;
  };
}

export interface BusinessPageContent {
  intro: {
    eyebrow: string;
    heading: string;
    description: string;
  };
  verticals: {
    id: string;
    index: string;
    title: string;
    eyebrow: string;
    description: string;
    capabilities: string[];
    cta: string;
    image: string;
    layout: "side" | "banner" | "reverse";
  }[];
}

export interface ProjectsPageContent {
  intro: {
    eyebrow: string;
    heading: string;
    description: string;
  };
  projects: {
    slug: string;
    name: string;
    category: "Construction" | "Supply" | "Infrastructure" | "Engineering";
    location: string;
    year: string;
    status: string;
    summary: string;
    overview: string;
    scope: string[];
    execution: string;
    image: string;
  }[];
}

export interface ExportPageContent {
  intro: {
    eyebrow: string;
    heading: string;
    description: string;
  };
  categories: {
    id: string;
    label: string;
    image: string;
  }[];
  process: {
    step: string;
    description: string;
  }[];
  products: {
    slug: string;
    name: string;
    category: string;
    origin: string;
    availability: string;
    moq: string;
    summary: string;
    image: string;
    images: string[];
    specifications: { label: string; value: string }[];
  }[];
}

export interface TeamPageContent {
  intro: {
    eyebrow: string;
    heading: string;
    description: string;
  };
  members: {
    id: string;
    name: string;
    title: string;
    department: string;
    image: string | null;
    initials: string;
    bio: string;
    expertise: string[];
  }[];
  departments: string[];
}

export interface ContactPageContent {
  hero: {
    eyebrow: string;
    heading: string;
    bgImage: string;
  };
  intro: {
    text: string;
  };
  coordinates: {
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    hours?: string;
  };
  formSettings: {
    inquirySectors: string[];
    successMessage: string;
  };
}

export interface SiteGlobalContent {
  companyInfo: {
    name: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
  };
  navLinks: {
    label: string;
    href: string;
  }[];
  footerColumns: {
    title: string;
    links: { label: string; href: string }[];
  }[];
}
