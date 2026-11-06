export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  status: 'active' | 'inactive';
  lastActive?: string;
}

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';

export type PermissionResource =
  | 'dashboard'
  | 'pages'
  | 'insights'
  | 'leads'
  | 'quotations'
  | 'clients'
  | 'partners'
  | 'tradeshows'
  | 'newsletter'
  | 'buyers'
  | 'users'
  | 'settings';

export type RolePermissions = Record<
  UserRole,
  Partial<Record<PermissionResource, PermissionAction[]>>
>;

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'image' | 'icon' | 'array' | 'boolean' | 'date';
  options?: string[]; // for select
  required?: boolean;
  translatable?: boolean; // optional AI auto-translate badge/feature
  placeholder?: string;
  description?: string;
}

export type BuyerType = 'international' | 'bangladesh';
export type LeadRequestType = 'quote' | 'sample' | 'general';

export interface LeadApplication {
  id: string;
  buyerId?: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country?: string;
  subject?: string;
  sector: string;
  buyerType: BuyerType;
  requestType?: LeadRequestType;
  productSlug?: string;
  quantity?: string;
  quantityUnit?: string;
  incoterm?: string;
  destinationPort?: string;
  targetShipDate?: string;
  paymentTerms?: string;
  status: 'Pending' | 'Reviewing' | 'Approved' | 'Rejected';
  budget?: string;
  message: string;
  notes?: string;
  createdAt: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'expired';

export interface QuotationLineItem {
  description: string;
  hsCode?: string;
  quantity: string;
  unit: string;
  unitPrice: number;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  leadId?: string;
  buyerId?: string;
  status: QuotationStatus;
  buyerName: string;
  buyerCompany?: string;
  buyerEmail: string;
  buyerCountry?: string;
  lineItems: QuotationLineItem[];
  currency: string;
  incoterm?: string;
  destinationPort?: string;
  paymentTerms?: string;
  validUntil?: string;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeShowItem {
  id: string;
  eventName: string;
  startDate: string;
  endDate?: string;
  location: string;
  boothNumber?: string;
  website?: string;
  description?: string;
  image?: string;
}

export interface BuyerAccount {
  id: string;
  name: string;
  company?: string;
  email: string;
  country?: string;
  phone?: string;
  emailVerified: boolean;
  leadCount: number;
  quotationCount: number;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  source?: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
}

export const INSIGHT_CATEGORIES = ['Industry News', 'Product News', 'Market Insight', 'Company News'] as const;

export interface InsightItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  relatedProductSlug: string;
  author: string;
  status: 'draft' | 'published';
  featured: boolean;
  publishedAt: string | null;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientItem {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  sector?: string;
  status: 'Active' | 'Inactive' | 'Prospect';
  logo?: string;
  clientSince?: string;
  notes?: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  category: 'Buyer' | 'Supplier' | 'Logistics Partner' | 'Institutional';
  country: string;
  logo: string;
  status: 'Active' | 'Pending';
  partnershipYear: number;
}

// ==========================================
// Comprehensive Page Content Specifications
// ==========================================

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

export interface ProductCertification {
  id: string;
  title: string;
  description: string;
  image: string;
  documentUrl?: string;
}

export interface ProductSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  noIndex: boolean;
}

export interface ExportProduct {
  slug: string;
  name: string;
  category: string;
  origin: string;
  availability: string;
  moq: string;
  hsCode?: string;
  priceBasis?: string;
  specSheetUrl?: string;
  summary: string;
  image: string;
  images: string[];
  specifications: { label: string; value: string }[];
  certificationsEnabled?: boolean;
  certifications?: ProductCertification[];
  insightUrl?: string;
  seo?: ProductSeo;
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
  products: ExportProduct[];
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

export interface SiteCredentials {
  exportLicenseNumber?: string;
  tradeLicenseNumber?: string;
  binNumber?: string;
  chamberOfCommerceMembership?: string;
  bankName?: string;
  bankBranch?: string;
  swiftCode?: string;
  companyProfileUrl?: string;
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
  credentials?: SiteCredentials;
}
