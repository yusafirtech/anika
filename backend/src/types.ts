export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  status: 'active' | 'inactive';
  lastActive?: string;
}

export interface LeadApplication {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  sector: string;
  status: 'Pending' | 'Reviewing' | 'Approved' | 'Archived';
  budget?: string;
  message: string;
  notes?: string;
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  bgImage: string;
  ctaText: string;
  ctaLink: string;
}

export interface MediaUpload {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  url: string;
  createdAt: string;
}

// Full Website Pages Content Interfaces
export interface HomePageContent {
  hero: {
    badgeText: string;
    keywords: string[];
    headline: string;
    subheadline: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    bgImage: string;
  };
  sectorStories: {
    id: string;
    index: string;
    category: string;
    badge: string;
    title: string;
    description: string;
    image: string;
    href: string;
  }[];
  businessShowcase: {
    id: string;
    index: string;
    title: string;
    description: string;
    image: string;
  }[];
  projectStories: {
    id: string;
    index: string;
    category: string;
    title: string;
    description: string;
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
    layout: 'side' | 'banner' | 'reverse';
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
    category: 'Construction' | 'Supply' | 'Infrastructure' | 'Engineering';
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
