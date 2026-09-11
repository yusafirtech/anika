import axios from 'axios';
import {
  LeadApplication,
  ClientItem,
  InsightItem,
  User,
  HomePageContent,
  AboutPageContent,
  BusinessPageContent,
  ProjectsPageContent,
  ExportPageContent,
  TeamPageContent,
  ContactPageContent,
  SiteGlobalContent,
} from './types';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Origin (scheme + host + port) the backend server is reachable at, used to
// resolve relative media URLs (e.g. /api/media/xyz.jpg) returned by the upload
// endpoint into absolute URLs that work anywhere the admin panel is loaded.
const apiOrigin = import.meta.env.VITE_API_ORIGIN || baseURL.replace(/\/api\/?$/, '');

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach bearer token
apiClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response interceptor: handle 401 redirects & error normalization
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// Seed Data for All Website Pages
// ==========================================

const INITIAL_HOMEPAGE: HomePageContent = {
  hero: {
    eyebrow: 'One Company · Multiple Sectors · One Connected Business',
    headlineWords: ['Building.', 'Supplying.', 'Exporting.', 'Connecting.'],
    subtitle: 'ANIKA TRADING & CO. connects Bangladesh’s capabilities with projects, supply chains and international markets.',
    bgImage: '/images/hero-port-supply-route.jpg',
    ctaText: 'START A CONVERSATION',
    ctaLink: '/contact',
    keywords: [
      'EXPORT',
      'SEAFOOD',
      'AGRICULTURE',
      'CONSTRUCTION',
      'GOVERNMENT TENDERS',
      'SUPPLY & TRADING',
    ],
  },
  sectorStories: [
    {
      id: 'international-trade',
      eyebrow: '01 / INTERNATIONAL TRADE',
      title: 'Connecting Quality Supply with Global Demand',
      description: 'Moving products from Bangladesh into international markets takes more than a good product — it takes reliability, consistent quality and a partner who understands both sides of the trade.',
      image: '/images/story-international-trade.jpg',
    },
    {
      id: 'seafood',
      eyebrow: '02 / SEAFOOD',
      title: 'Reliable Seafood Supply Requires More Than a Product',
      description: 'From sourcing to processing to export-ready packaging, seafood supply depends on consistency at every stage — cold chain discipline, quality control and the capacity to deliver at scale.',
      image: '/images/story-seafood.jpg',
    },
    {
      id: 'vegetables',
      eyebrow: '03 / VEGETABLES & AGRICULTURE',
      title: 'From Local Production to International Opportunity',
      description: 'Fresh vegetables and agricultural produce carry real export potential when sourcing, grading, packaging and logistics are handled with the same discipline as any other traded commodity.',
      image: '/images/story-vegetable-market.jpg',
    },
    {
      id: 'construction',
      eyebrow: '04 / CONSTRUCTION',
      title: 'Projects Demand Capability, Coordination and Execution',
      description: 'Construction and infrastructure work is won or lost on coordination — materials, manpower, timelines and site execution all have to move together.',
      image: '/images/story-construction-site.jpg',
    },
    {
      id: 'government-supply',
      eyebrow: '05 / GOVERNMENT & INSTITUTIONAL SUPPLY',
      title: 'Supporting Large-Scale Institutional Requirements',
      description: 'Government and institutional procurement calls for a supplier who can meet specification, scale and process requirements — and follow through on delivery.',
      image: '/images/story-institutional-supply.jpg',
    },
  ],
  businessShowcase: [
    {
      id: 'export',
      index: '01',
      title: 'Export & International Trade',
      description: 'Bangladesh-origin seafood and agricultural products, prepared and packaged for international buyers looking for a dependable B2B supply partner.',
      points: ['Seafood & agricultural exports', 'Bangladesh-origin sourcing', 'B2B buyer relationships'],
      cta: 'Explore Export',
      href: '/export',
      image: '/images/story-global-connection.jpg',
    },
    {
      id: 'seafood-supply',
      index: '02',
      title: 'Seafood Supply',
      description: 'End-to-end seafood supply built around quality control, cold chain handling and export-ready packaging for both local and international buyers.',
      points: ['Sourcing & processing', 'Cold chain handling', 'Export-ready packaging'],
      cta: 'View Seafood Supply',
      href: '/business',
      image: '/images/story-seafood-closeup.jpg',
    },
    {
      id: 'vegetables-agri',
      index: '03',
      title: 'Vegetable & Agricultural Products',
      description: 'Sourcing and supplying fresh vegetables and agricultural produce, with the grading and packaging discipline international markets expect.',
      points: ['Fresh produce sourcing', 'Grading & packaging', 'Market-ready supply'],
      cta: 'View Agricultural Supply',
      href: '/business',
      image: '/images/story-agriculture-origin.jpg',
    },
    {
      id: 'construction',
      index: '04',
      title: 'Construction & Projects',
      description: 'Construction and project execution capability covering coordination, materials supply and on-site delivery from start to finish.',
      points: ['Project execution', 'Materials coordination', 'On-site delivery'],
      cta: 'View Construction',
      href: '/business',
      image: '/images/materials-detail.jpg',
    },
    {
      id: 'government-tender',
      index: '05',
      title: 'Government Tender & Supply',
      description: 'Participation in government and institutional tenders, with the supply infrastructure to meet procurement specifications and timelines.',
      points: ['Tender participation', 'Institutional procurement', 'Large-scale supply'],
      cta: 'View Government Supply',
      href: '/business',
      image: '/images/story-institutional-supply.jpg',
    },
    {
      id: 'trading-distribution',
      index: '06',
      title: 'Trading & Distribution',
      description: 'Import, trading and distribution operations that connect suppliers, products and buyers across Bangladesh’s business network.',
      points: ['Import & trading', 'Distribution network', 'Business partnerships'],
      cta: 'View Trading',
      href: '/business',
      image: '/images/story-business-network.jpg',
    },
  ],
  whyReasons: [
    {
      id: 'multi-sector',
      index: '01',
      title: 'Multi-Sector Capability',
      description: 'ANIKA operates across export, seafood, agricultural products, construction, supply and trading — one organization, several connected capabilities.',
      image: '/images/story-business-network.jpg',
    },
    {
      id: 'supply-execution',
      index: '02',
      title: 'Supply & Execution',
      description: 'Capability extends beyond sourcing to supply, coordination and project execution, from first order to final delivery.',
      image: '/images/story-institutional-supply.jpg',
    },
    {
      id: 'bangladesh-advantage',
      index: '03',
      title: 'Bangladesh-Based Advantage',
      description: 'Connecting international opportunities with Bangladesh-based products, suppliers and business capabilities.',
      image: '/images/story-agriculture-origin.jpg',
    },
    {
      id: 'international-focus',
      index: '04',
      title: 'International Business Focus',
      description: 'Built to connect Bangladesh-origin products and capabilities with international buyers and partners.',
      image: '/images/story-global-connection.jpg',
    },
    {
      id: 'partnership-mindset',
      index: '05',
      title: 'Partnership Mindset',
      description: 'A focus on long-term business relationships rather than one-off transactions, on every side of the business.',
      image: '/images/why-anika-collaboration.jpg',
    },
    {
      id: 'one-business',
      index: '06',
      title: 'One Connected Business',
      description: 'Multiple business capabilities under one organization, coordinated rather than siloed.',
      image: '/images/story-infrastructure.jpg',
    },
  ],
  cta: {
    eyebrow: 'Business Inquiry',
    heading: 'Let’s Build the Next Opportunity Together.',
    description: 'Whether you are looking for products from Bangladesh, exploring a supply requirement, discussing a project or seeking a business partnership, talk to ANIKA.',
    primaryCtaText: 'START A CONVERSATION',
    primaryCtaLink: '/contact',
    secondaryCtaText: 'EXPLORE EXPORT PRODUCTS',
    secondaryCtaLink: '/export',
    bgImage: '/images/final-cta-port.jpg',
  },
};

const INITIAL_ABOUTPAGE: AboutPageContent = {
  intro: {
    eyebrow: 'About ANIKA TRADING & CO.',
    heading: 'Built to Connect Capabilities Across Sectors',
    leadText: 'ANIKA TRADING & CO. was founded with a singular conviction: that a modern business company in Bangladesh can achieve far greater impact by bridging high-value sectors rather than operating in isolation.',
    bodyText: 'From our origins in construction and project coordination to expanding into government procurement, private-sector distribution, and global export markets, we have built an infrastructure grounded in reliability, strict compliance, and execution discipline.',
    image: '/images/materials-detail.jpg',
    stats: [
      { value: '6+', label: 'Connected Business Verticals' },
      { value: '15+', label: 'Years of Multi-Sector Experience' },
      { value: '100%', label: 'Commitment to Quality & Delivery' },
    ],
  },
  timeline: [
    {
      id: 'origin',
      label: 'ORIGIN',
      title: 'A Bangladesh-Based Business Company',
      description: 'ANIKA began as a Bangladesh-based business company, built to operate across more than one sector rather than specialize narrowly in one.',
      image: '/images/materials-detail.jpg',
    },
    {
      id: 'construction',
      label: 'CONSTRUCTION',
      title: 'Building Project Execution Capability',
      description: 'Construction and project work established the company’s discipline around coordination, materials and on-site delivery.',
      image: '/images/story-construction-site.jpg',
    },
    {
      id: 'supply',
      label: 'SUPPLY',
      title: 'Extending into Government & Institutional Supply',
      description: 'That execution capability extended naturally into government and institutional supply, where scale and specification matter as much as delivery.',
      image: '/images/story-institutional-supply.jpg',
    },
    {
      id: 'distribution',
      label: 'DISTRIBUTION',
      title: 'Building a Distribution Network',
      description: 'Distribution and private-sector supply work grew the company’s network of business relationships across Bangladesh.',
      image: '/images/story-business-network.jpg',
    },
    {
      id: 'trading',
      label: 'TRADING',
      title: 'Import & Trading Operations',
      description: 'Import and trading operations connected ANIKA to a wider set of suppliers, products and business partners.',
      image: '/images/trade-detail.jpg',
    },
    {
      id: 'export',
      label: 'EXPORT',
      title: 'Reaching International Markets',
      description: 'Today, that same foundation supports international export — connecting Bangladesh-origin products with buyers abroad.',
      image: '/images/story-international-trade.jpg',
    },
  ],
  missionVision: {
    missionTitle: 'Our Mission',
    missionText: 'To connect Bangladesh’s resources, manpower, and production capabilities with domestic infrastructure demands and international markets through rigorous quality control and trustworthy partnerships.',
    visionTitle: 'Our Vision',
    visionText: 'To be Bangladesh’s premier multi-sector trading and execution conglomerate, recognized internationally for transparency, high standards, and scalable B2B trade partnerships.',
    pillars: [
      'Uncompromising product grading and cold chain compliance',
      'Structured on-time project execution and materials logistics',
      'Direct, transparent relationships with international importers',
      'Sustainable and ethical sourcing across coastal and agricultural belts',
    ],
  },
  coreValues: [
    { id: 'integrity', label: 'INTEGRITY', description: 'Doing business honestly, even when no one is checking.' },
    { id: 'reliability', label: 'RELIABILITY', description: 'Being the partner who delivers what was promised.' },
    { id: 'quality', label: 'QUALITY', description: 'Holding products and execution to a consistent standard.' },
    { id: 'professionalism', label: 'PROFESSIONALISM', description: 'Operating with the discipline serious business requires.' },
    { id: 'partnership', label: 'PARTNERSHIP', description: 'Building relationships that outlast a single transaction.' },
    { id: 'growth', label: 'GROWTH', description: 'Growing capability deliberately, sector by sector.' },
  ],
  philosophy: {
    quote: 'We believe capability is not proclaimed — it is demonstrated through delivery, order after order, site after site.',
    narrative: 'Across every sector we operate in, our priority remains the same: establishing sustainable, win-win business partnerships that create real value for our clients, our workers, and our country.',
    authorName: 'Md. Anisur Rahman',
    authorTitle: 'Founder & Managing Director, ANIKA TRADING & CO.',
    image: '/images/why-anika-collaboration.jpg',
  },
};

const INITIAL_BUSINESSPAGE: BusinessPageContent = {
  intro: {
    eyebrow: 'Our Business Verticals',
    heading: 'A Connected Ecosystem of Capabilities',
    description: 'ANIKA operates across six integrated business verticals, delivering specialized capability with the financial and operational backing of a single consolidated company.',
  },
  verticals: [
    {
      id: 'construction',
      index: '01',
      title: 'Construction & Projects',
      eyebrow: 'Capability',
      description: 'Construction and project work covering coordination, materials and on-site execution — from planning through to delivery.',
      capabilities: ['Project execution', 'Site coordination', 'Materials supply', 'Infrastructure work'],
      cta: 'Discuss a Project',
      image: '/images/story-construction-site.jpg',
      layout: 'side',
    },
    {
      id: 'government-supply',
      index: '02',
      title: 'Government Supply',
      eyebrow: 'Procurement',
      description: 'Participation in government supply and tender processes, with the infrastructure to meet institutional specifications and timelines.',
      capabilities: ['Tender participation', 'Institutional procurement', 'Specification compliance', 'Large-scale supply'],
      cta: 'Send Supply Requirement',
      image: '/images/story-institutional-supply.jpg',
      layout: 'reverse',
    },
    {
      id: 'private-supply',
      index: '03',
      title: 'Private Supply & Distribution',
      eyebrow: 'Distribution',
      description: 'Bulk supply and distribution for private-sector requirements, connecting suppliers and buyers through a coordinated business-to-business network.',
      capabilities: ['Bulk supply', 'Distribution network', 'B2B fulfilment'],
      cta: 'Request Business Inquiry',
      image: '/images/story-business-network.jpg',
      layout: 'banner',
    },
    {
      id: 'trading',
      index: '04',
      title: 'Import & Trading',
      eyebrow: 'Trading',
      description: 'Sourcing, trading and supply networks that facilitate business across a wider set of products and partners.',
      capabilities: ['Sourcing', 'Import & trading', 'Supply networks'],
      cta: 'Discuss Trading',
      image: '/images/trade-detail.jpg',
      layout: 'side',
    },
    {
      id: 'export',
      index: '05',
      title: 'Export',
      eyebrow: 'International',
      description: 'Bangladesh-origin products — seafood, vegetables and agricultural produce — prepared and exported for international buyers.',
      capabilities: ['Seafood & agricultural exports', 'Export packaging', 'International buyer relationships'],
      cta: 'Explore Export Products',
      image: '/images/story-seafood-closeup.jpg',
      layout: 'reverse',
    },
    {
      id: 'international-business',
      index: '06',
      title: 'International Business',
      eyebrow: 'Partnerships',
      description: 'Cross-border business relationships built around international buyers, partnerships and export opportunities.',
      capabilities: ['International partnerships', 'Cross-border business', 'Buyer development'],
      cta: 'Become a Buyer',
      image: '/images/story-global-connection.jpg',
      layout: 'side',
    },
  ],
};

const INITIAL_PROJECTSPAGE: ProjectsPageContent = {
  intro: {
    eyebrow: 'Execution Portfolio',
    heading: 'What ANIKA Has Actually Worked On',
    description: 'Explore our track record across infrastructure, building construction, and high-volume industrial supply logistics.',
  },
  projects: [
    {
      slug: 'infrastructure-environment',
      name: 'Infrastructure & Environment',
      category: 'Construction',
      location: 'Bangladesh',
      year: '2024 - Present',
      status: 'In Progress',
      summary: 'Infrastructure-scale project work spanning site engineering, materials coordination and phased execution.',
      overview: 'This project reflects ANIKA’s capability to take on infrastructure-scale work that requires coordination across engineering, materials and site teams over an extended timeline.',
      scope: ['Site engineering coordination', 'Materials sourcing & logistics', 'Phased project execution'],
      execution: 'Work is coordinated in phases, with materials and manpower scheduled against site milestones as the project progresses.',
      image: '/images/project-bridge.jpg',
    },
    {
      slug: 'building-construction',
      name: 'Building Construction',
      category: 'Construction',
      location: 'Bangladesh',
      year: '2023 - Present',
      status: 'In Progress',
      summary: 'Ground-up building construction, coordinated across structural, material and manpower requirements.',
      overview: 'A ground-up construction project covering structural work through to finishing, coordinated by ANIKA’s project execution team.',
      scope: ['Structural construction', 'Manpower coordination', 'Material supply'],
      execution: 'Execution follows standard construction sequencing, with ANIKA coordinating suppliers and on-site teams throughout.',
      image: '/images/project-building.jpg',
    },
    {
      slug: 'engineering-operations',
      name: 'Engineering Operations',
      category: 'Construction',
      location: 'Bangladesh',
      year: 'Ongoing',
      status: 'Ongoing',
      summary: 'On-site engineering and operations management supporting active project delivery.',
      overview: 'Engineering and operations management work supporting the day-to-day running of an active project site.',
      scope: ['On-site engineering support', 'Operations management', 'Quality oversight'],
      execution: 'A dedicated operations presence on site ensures engineering decisions and day-to-day execution stay aligned.',
      image: '/images/project-engineering.jpg',
    },
    {
      slug: 'materials-to-site',
      name: 'Materials to Site',
      category: 'Supply',
      location: 'Bangladesh',
      year: 'Ongoing',
      status: 'Ongoing',
      summary: 'Materials sourcing and logistics, moving supply from origin to active project sites.',
      overview: 'A supply and logistics project moving construction materials from source to active project sites on schedule.',
      scope: ['Materials sourcing', 'Logistics & transport', 'Site delivery scheduling'],
      execution: 'Deliveries are scheduled against site demand, with sourcing and transport coordinated to avoid delays.',
      image: '/images/project-logistics.jpg',
    },
    {
      slug: 'industrial-capability',
      name: 'Industrial Capability',
      category: 'Supply',
      location: 'Bangladesh',
      year: 'Ongoing',
      status: 'Ongoing',
      summary: 'Industrial-scale supply and coordination capability supporting institutional requirements.',
      overview: 'Industrial-scale supply coordination supporting institutional and large-volume requirements.',
      scope: ['Industrial supply coordination', 'Institutional requirements', 'Volume scheduling'],
      execution: 'Supply volumes are planned and scheduled to match institutional requirements as they’re confirmed.',
      image: '/images/project-industrial.jpg',
    },
  ],
};

const INITIAL_EXPORTPAGE: ExportPageContent = {
  intro: {
    eyebrow: 'B2B International Trade',
    heading: 'Bangladesh Origin, World-Class Quality',
    description: 'Supplying international buyers with certified Bangladesh seafood, freshwater prawn, and agricultural produce.',
  },
  categories: [
    { id: 'seafood', label: 'Seafood', image: '/images/story-seafood-closeup.jpg' },
    { id: 'frozen-fish', label: 'Frozen Fish', image: '/images/story-seafood.jpg' },
    { id: 'vegetables', label: 'Vegetables', image: '/images/story-vegetable-market.jpg' },
    { id: 'agricultural-products', label: 'Agricultural Products', image: '/images/story-agriculture-origin.jpg' },
  ],
  process: [
    { step: 'Source', description: 'Identifying reliable Bangladesh-origin supply directly at coastal farms and agricultural belts.' },
    { step: 'Quality', description: 'Checking product grading, freshness, and microbiological standards against buyer requirements.' },
    { step: 'Prepare', description: 'Preparing, sorting, and grading product for export in certified processing facilities.' },
    { step: 'Pack', description: 'Export-appropriate packaging with IQF, block freezing, and custom private label cartons.' },
    { step: 'Ship', description: 'Coordinating cold-chain container freight from Chittagong or Mongla port.' },
    { step: 'Deliver', description: 'Clearance documentation confirmation and delivery assurance with the overseas buyer.' },
  ],
  products: [
    {
      slug: 'frozen-shrimp',
      name: 'Frozen Shrimp',
      category: 'Seafood',
      origin: 'Bangladesh',
      availability: 'Seasonal',
      moq: '1 x 20ft FCL (approx. 12,000 kg)',
      summary: 'Frozen shrimp sourced and processed for export, packed to preserve quality through international shipment.',
      image: '/images/story-seafood-closeup.jpg',
      images: [
        '/images/story-seafood-closeup.jpg',
        '/images/story-seafood.jpg',
        '/images/trade-detail.jpg',
        '/images/story-international-trade.jpg',
      ],
      specifications: [
        { label: 'Product category', value: 'Seafood' },
        { label: 'Origin', value: 'Bangladesh' },
        { label: 'Grading / Size', value: '16/20, 21/25, 26/30, 31/40 count/lb' },
        { label: 'Packaging', value: 'Master Carton / IQF / Block' },
        { label: 'Storage', value: 'Frozen / -18°C continuous cold chain' },
        { label: 'Documentation', value: 'Health Certificate, Phytosanitary, Certificate of Origin' },
      ],
    },
    {
      slug: 'fresh-frozen-fish',
      name: 'Fresh & Frozen Fish',
      category: 'Frozen Fish',
      origin: 'Bangladesh',
      availability: 'Year-round',
      moq: '1 x 20ft FCL',
      summary: 'Fresh and frozen fish supply, processed and packaged to export-ready condition.',
      image: '/images/story-seafood.jpg',
      images: [
        '/images/story-seafood.jpg',
        '/images/story-seafood-closeup.jpg',
        '/images/trade-detail.jpg',
        '/images/hero-port-supply-route.jpg',
      ],
      specifications: [
        { label: 'Product category', value: 'Frozen Fish' },
        { label: 'Origin', value: 'Bangladesh' },
        { label: 'Processing', value: 'Whole Round / Gutted / Scaled' },
        { label: 'Packaging', value: 'Bulk Poly Bag in Corrugated Master Cartons' },
        { label: 'Storage', value: 'Frozen / cold chain' },
      ],
    },
    {
      slug: 'fresh-vegetables',
      name: 'Fresh Vegetables',
      category: 'Vegetables',
      origin: 'Bangladesh',
      availability: 'Seasonal',
      moq: '5,000 kg per consignment',
      summary: 'Fresh vegetables sourced, graded and packed for both regional and international buyers.',
      image: '/images/story-vegetable-market.jpg',
      images: [
        '/images/story-vegetable-market.jpg',
        '/images/story-agriculture-origin.jpg',
        '/images/trade-detail.jpg',
        '/images/story-global-connection.jpg',
      ],
      specifications: [
        { label: 'Product category', value: 'Vegetables' },
        { label: 'Origin', value: 'Bangladesh' },
        { label: 'Packaging', value: 'Ventilated Corrugated Boxes / Mesh Bags' },
        { label: 'Transit', value: 'Air Freight / Reefer Sea Container' },
      ],
    },
    {
      slug: 'agricultural-produce',
      name: 'Agricultural Produce',
      category: 'Agricultural Products',
      origin: 'Bangladesh',
      availability: 'Seasonal',
      moq: '1 x 20ft container',
      summary: 'Bangladesh-origin agricultural produce, sourced and prepared to meet export specifications.',
      image: '/images/story-agriculture-origin.jpg',
      images: [
        '/images/story-agriculture-origin.jpg',
        '/images/story-vegetable-market.jpg',
        '/images/trade-detail.jpg',
        '/images/story-global-connection.jpg',
      ],
      specifications: [
        { label: 'Product category', value: 'Agricultural Products' },
        { label: 'Origin', value: 'Bangladesh' },
        { label: 'Packaging', value: 'Standard export grade sacks and boxes' },
      ],
    },
  ],
};

const INITIAL_TEAMPAGE: TeamPageContent = {
  intro: {
    eyebrow: 'Leadership & People',
    heading: 'The Team Driving ANIKA Forward',
    description: 'Meet the executives, directors, and operational specialists leading multi-sector execution across our company.',
  },
  members: [
    {
      id: 'md-anika',
      name: 'Md. Anisur Rahman',
      title: 'Founder & Managing Director',
      department: 'Executive Leadership',
      image: '/images/team-ceo.jpg',
      initials: 'AR',
      bio: 'Md. Anisur Rahman founded ANIKA TRADING & CO. with a clear vision: to build a diversified business company capable of operating across multiple high-value sectors in Bangladesh and beyond. With over 15 years of experience spanning construction, government procurement, supply chain management, and international trade.',
      expertise: [
        'Strategic Business Development',
        'Government Procurement & Tendering',
        'Construction Project Management',
        'International Trade & Export',
      ],
    },
    {
      id: 'rafiqul-islam',
      name: 'Rafiqul Islam',
      title: 'Director of Operations',
      department: 'Operations',
      image: '/images/team-director-ops.jpg',
      initials: 'RI',
      bio: 'Rafiqul Islam oversees the operational backbone of ANIKA’s business — from site execution and procurement logistics to vendor management and project coordination.',
      expertise: [
        'Supply Chain & Logistics',
        'Project Site Coordination',
        'Vendor & Procurement Management',
        'Quality Control Systems',
      ],
    },
    {
      id: 'farhana-hossain',
      name: 'Farhana Hossain',
      title: 'Head of Export & International Trade',
      department: 'Export Division',
      image: '/images/team-export-head.jpg',
      initials: 'FH',
      bio: 'Farhana Hossain leads ANIKA’s international export division, managing relationships with overseas buyers, coordinating documentation and compliance, and overseeing product sourcing.',
      expertise: [
        'International Trade Documentation',
        'Buyer Relationship Management',
        'Export Compliance & Regulation',
        'Cross-border Logistics',
      ],
    },
  ],
  departments: [
    'All',
    'Executive Leadership',
    'Operations',
    'Export Division',
    'Finance',
    'Government Relations',
    'Construction',
  ],
};

const INITIAL_CONTACTPAGE: ContactPageContent = {
  hero: {
    eyebrow: 'Get In Touch',
    heading: 'Let’s Start a Conversation',
    bgImage: '/images/trade-detail.jpg',
  },
  intro: {
    text: 'Whether you’re exploring a construction project, a government or private supply requirement, an import or export inquiry, or a business partnership — reach out and the ANIKA team will get back to you.',
  },
  coordinates: {
    address: 'Gulshan & Motijheel Commercial Area, Dhaka, Bangladesh',
    phone: '+880 1711 000000',
    email: 'info@anikatrading.com',
    whatsapp: '+61 469 024 249',
    hours: 'Sunday – Thursday: 9:00 AM – 6:00 PM (GMT+6)',
  },
  formSettings: {
    inquirySectors: [
      'Export & International Trade',
      'Seafood Supply',
      'Agricultural Products',
      'Construction & Projects',
      'Government Tender & Supply',
      'General Partnership',
    ],
    successMessage: 'Thank you for reaching out to ANIKA TRADING & CO. An authorized trade specialist will review your inquiry and follow up within 24 hours.',
  },
};

const INITIAL_SITEGLOBAL: SiteGlobalContent = {
  companyInfo: {
    name: 'ANIKA TRADING & CO.',
    tagline: 'Building. Supplying. Exporting. Connecting.',
    address: 'Dhaka & Chittagong, Bangladesh',
    phone: '+880 1711 000000',
    email: 'info@anikatrading.com',
    whatsapp: '+61 469 024 249',
  },
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Business', href: '/business' },
    { label: 'Projects', href: '/projects' },
    { label: 'Export', href: '/export' },
    { label: 'Contact', href: '/contact' },
  ],
  footerColumns: [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Mission & Vision', href: '/about#mission' },
        { label: 'Business', href: '/business' },
        { label: 'Projects', href: '/projects' },
      ],
    },
    {
      title: 'Business',
      links: [
        { label: 'Construction & Projects', href: '/business#construction' },
        { label: 'Government Supply', href: '/business#government-supply' },
        { label: 'Supply & Distribution', href: '/business#private-supply' },
        { label: 'Import & Trading', href: '/business#trading' },
      ],
    },
    {
      title: 'Export',
      links: [
        { label: 'Export Overview', href: '/export' },
        { label: 'Product Categories', href: '/export#categories' },
        { label: 'Export Products', href: '/export/products' },
        { label: 'Send a Requirement', href: '/contact' },
      ],
    },
  ],
};

const INITIAL_LEADS: LeadApplication[] = [
  {
    id: 'lead-1',
    name: 'Tariq Al-Mansoor',
    company: 'Gulf Horizon Trading LLC',
    email: 'tariq@gulfhorizon.ae',
    phone: '+971 4 882 1920',
    sector: 'Seafood',
    buyerType: 'international',
    status: 'Pending',
    budget: '$150,000 - $300,000',
    message: 'Seeking bulk supply contracts for Black Tiger shrimp and freshwater prawn for Q4 retail distribution in Dubai and Qatar.',
    notes: 'Requested export certificate and cold-chain compliance specs.',
    createdAt: '2026-09-06T10:14:00Z',
  },
  {
    id: 'lead-2',
    name: 'Marcus Vance',
    company: 'EuroAsia Logistics BV',
    email: 'm.vance@euroasialog.nl',
    phone: '+31 20 592 3311',
    sector: 'Agriculture',
    buyerType: 'international',
    status: 'Reviewing',
    budget: '$80,000 - $120,000',
    message: 'Inquiring about organic potato and fresh vegetable cargo freight schedules from Chittagong port to Rotterdam.',
    notes: 'Reviewed preliminary packing standards.',
    createdAt: '2026-09-05T14:30:00Z',
  },
  {
    id: 'lead-3',
    name: 'Eng. Rafiqul Islam',
    company: 'Padma Bridge Rail Extension Project',
    email: 'rafiqul.project@padmarail.gov.bd',
    phone: '+880 1711 902341',
    sector: 'Government Tender',
    buyerType: 'bangladesh',
    status: 'Approved',
    budget: '$1,200,000',
    message: 'Specification submission for high-grade structural reinforcement steel and aggregate grading tender package 04.',
    notes: 'Contract awarded. Signed preliminary NDA.',
    createdAt: '2026-09-02T09:00:00Z',
  },
];

const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'admin',
    name: 'Managing Director',
    email: 'admin@anikatrading.com',
    role: 'admin',
    department: 'Executive Board',
    status: 'active',
    lastActive: 'Just now',
  },
  {
    id: 'usr-2',
    username: 'manager',
    name: 'Operations Manager',
    email: 'operations@anikatrading.com',
    role: 'manager',
    department: 'Supply & Logistics',
    status: 'active',
    lastActive: '2 hours ago',
  },
  {
    id: 'usr-3',
    username: 'editor',
    name: 'Content & Media Editor',
    email: 'editor@anikatrading.com',
    role: 'editor',
    department: 'Marketing & Brand',
    status: 'active',
    lastActive: 'Yesterday',
  },
];

function getStored<T>(key: string, fallback: T): T {
  const data = localStorage.getItem(`anika_admin_${key}`);
  if (!data) {
    localStorage.setItem(`anika_admin_${key}`, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  localStorage.setItem(`anika_admin_${key}`, JSON.stringify(value));
}

// ----------------------------------------------------
// FULL PRODUCTION BACKEND API INTEGRATION (MySQL)
// ----------------------------------------------------
export const backendApi = {
  // 0. Authentication (MySQL `users`, JWT-backed sessions)
  auth: {
    login: async (username: string, password: string): Promise<{ token: string; user: User }> => {
      const res = await apiClient.post('/auth/login', { username, password });
      return res.data;
    },
  },

  // 1. Pages CMS Management (MySQL `pages_content`)
  pages: {
    get: async <T>(pageKey: string, fallback: T): Promise<T> => {
      try {
        const res = await apiClient.get(`/pages/${pageKey}`);
        if (res.data && res.data.content) {
          setStored(`page_${pageKey}`, res.data.content);
          return res.data.content as T;
        }
        return getStored(`page_${pageKey}`, fallback);
      } catch (err) {
        console.warn(`[Backend API] Page '${pageKey}' fetch failed, using local cache:`, err);
        return getStored(`page_${pageKey}`, fallback);
      }
    },
    save: async <T>(pageKey: string, content: T): Promise<boolean> => {
      setStored(`page_${pageKey}`, content);
      try {
        await apiClient.put(`/pages/${pageKey}`, { content });
        return true;
      } catch (err) {
        console.warn(`[Backend API] Page '${pageKey}' save failed, stored in local cache:`, err);
        return false;
      }
    },
  },

  // 2. Database Media Uploads (MySQL `media_uploads` LONGBLOB)
  upload: {
    uploadImage: async (file: File): Promise<{ url: string; filename: string; id: number }> => {
      const formData = new FormData();
      formData.append('image', file);
      const res = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // The backend returns url e.g. /api/media/img-123.jpg.
      // Prepend host if relative so it displays anywhere
      const relativeUrl = res.data.url;
      const fullUrl = relativeUrl.startsWith('http')
        ? relativeUrl
        : `${apiOrigin}${relativeUrl}`;

      return {
        url: fullUrl,
        filename: res.data.filename,
        id: res.data.id,
      };
    },
    list: async (): Promise<any[]> => {
      try {
        const res = await apiClient.get('/media');
        return res.data.media || [];
      } catch (err) {
        console.warn('[Backend API] Failed to list media:', err);
        return [];
      }
    },
  },

  // 3. Trade Leads (MySQL `leads`)
  leads: {
    getAll: async (params?: { status?: string; sector?: string; search?: string }): Promise<LeadApplication[]> => {
      try {
        const res = await apiClient.get('/leads', { params });
        if (res.data && res.data.leads) {
          // Normalize raw MySQL snake_case rows to the frontend's camelCase shape
          const normalized: LeadApplication[] = res.data.leads.map((row: any) => ({
            ...row,
            createdAt: row.createdAt || row.created_at,
            buyerType: row.buyerType || row.buyer_type || 'international',
          }));
          setStored('leads', normalized);
          return normalized;
        }
        return getStored('leads', INITIAL_LEADS);
      } catch (err) {
        return getStored('leads', INITIAL_LEADS);
      }
    },
    update: async (id: string, updates: { status?: string; notes?: string }): Promise<boolean> => {
      try {
        await apiClient.patch(`/leads/${id}`, updates);
        return true;
      } catch (err) {
        console.warn(`[Backend API] Failed to update lead ${id}:`, err);
        return false;
      }
    },
    delete: async (id: string): Promise<boolean> => {
      try {
        await apiClient.delete(`/leads/${id}`);
        return true;
      } catch (err) {
        console.warn(`[Backend API] Failed to delete lead ${id}:`, err);
        return false;
      }
    },
  },

  // 4. Generic Content Collections (MySQL `content_collections`) — Hero, Products, Projects, Team, Partners
  collections: {
    get: async <T>(key: string, fallback: T[]): Promise<T[]> => {
      try {
        const res = await apiClient.get(`/collections/${key}`);
        if (res.data && Array.isArray(res.data.items)) {
          setStored(`collection_${key}`, res.data.items);
          return res.data.items as T[];
        }
        return getStored(`collection_${key}`, fallback);
      } catch (err) {
        console.warn(`[Backend API] Collection '${key}' fetch failed, using local cache:`, err);
        return getStored(`collection_${key}`, fallback);
      }
    },
    save: async <T>(key: string, items: T[]): Promise<boolean> => {
      setStored(`collection_${key}`, items);
      try {
        await apiClient.put(`/collections/${key}`, { items });
        return true;
      } catch (err) {
        console.warn(`[Backend API] Collection '${key}' save failed, stored in local cache:`, err);
        return false;
      }
    },
  },

  // 5. Admin Users & RBAC (MySQL `users`)
  users: {
    getAll: async (): Promise<User[]> => {
      try {
        const res = await apiClient.get('/users');
        if (res.data && res.data.users) {
          // Normalize raw MySQL snake_case rows (last_active) to the frontend's camelCase shape
          const normalized: User[] = res.data.users.map((row: any) => ({
            ...row,
            lastActive: row.lastActive || row.last_active,
          }));
          setStored('users', normalized);
          return normalized;
        }
        return getStored('users', INITIAL_USERS);
      } catch (err) {
        return getStored('users', INITIAL_USERS);
      }
    },
    create: async (userData: Partial<User> & { password?: string }): Promise<any> => {
      const res = await apiClient.post('/users', userData);
      return res.data;
    },
    update: async (id: string, updates: Partial<User> & { password?: string }): Promise<any> => {
      const res = await apiClient.patch(`/users/${id}`, updates);
      return res.data;
    },
    updateSelf: async (updates: {
      name?: string;
      username?: string;
      avatar?: string;
      currentPassword?: string;
      newPassword?: string;
    }): Promise<{ success: boolean; user: User }> => {
      const res = await apiClient.patch('/users/me', updates);
      return res.data;
    },
    delete: async (id: string): Promise<any> => {
      const res = await apiClient.delete(`/users/${id}`);
      return res.data;
    },
  },

  // 6. Client Management (MySQL `clients`)
  clients: {
    getAll: async (params?: { status?: string; sector?: string; search?: string }): Promise<ClientItem[]> => {
      const res = await apiClient.get('/clients', { params });
      const rows = (res.data && res.data.clients) || [];
      // Normalize raw MySQL snake_case rows to the frontend's camelCase shape
      return rows.map((row: any) => ({
        ...row,
        contactPerson: row.contactPerson ?? row.contact_person,
        clientSince: row.clientSince ?? row.client_since,
      }));
    },
    create: async (clientData: Partial<ClientItem>): Promise<{ success: boolean; client: ClientItem }> => {
      const res = await apiClient.post('/clients', clientData);
      return res.data;
    },
    update: async (id: string, updates: Partial<ClientItem>): Promise<{ success: boolean; client: ClientItem }> => {
      const res = await apiClient.patch(`/clients/${id}`, updates);
      return res.data;
    },
    delete: async (id: string): Promise<any> => {
      const res = await apiClient.delete(`/clients/${id}`);
      return res.data;
    },
  },

  // 7. Insights (MySQL `insights`) — industry news, product news, company updates
  insights: {
    getAll: async (): Promise<InsightItem[]> => {
      const res = await apiClient.get('/insights/manage/all');
      return (res.data && res.data.insights) || [];
    },
    create: async (data: Partial<InsightItem>): Promise<{ success: boolean; insight: InsightItem }> => {
      const res = await apiClient.post('/insights', data);
      return res.data;
    },
    update: async (id: string, updates: Partial<InsightItem>): Promise<{ success: boolean; insight: InsightItem }> => {
      const res = await apiClient.patch(`/insights/${id}`, updates);
      return res.data;
    },
    delete: async (id: string): Promise<any> => {
      const res = await apiClient.delete(`/insights/${id}`);
      return res.data;
    },
  },
};

// Seamless hybrid database: Local fast cache + instant MySQL synchronization
export const mockDb = {
  // Page Content Managers
  getHomePage: (): HomePageContent => getStored('page_home', INITIAL_HOMEPAGE),
  saveHomePage: (content: HomePageContent) => {
    setStored('page_home', content);
    backendApi.pages.save('home', content);
  },

  getAboutPage: (): AboutPageContent => getStored('page_about', INITIAL_ABOUTPAGE),
  saveAboutPage: (content: AboutPageContent) => {
    setStored('page_about', content);
    backendApi.pages.save('about', content);
  },

  getBusinessPage: (): BusinessPageContent => getStored('page_business', INITIAL_BUSINESSPAGE),
  saveBusinessPage: (content: BusinessPageContent) => {
    setStored('page_business', content);
    backendApi.pages.save('business', content);
  },

  getProjectsPage: (): ProjectsPageContent => getStored('page_projects', INITIAL_PROJECTSPAGE),
  saveProjectsPage: (content: ProjectsPageContent) => {
    setStored('page_projects', content);
    backendApi.pages.save('projects', content);
  },

  getExportPage: (): ExportPageContent => getStored('page_export', INITIAL_EXPORTPAGE),
  saveExportPage: (content: ExportPageContent) => {
    setStored('page_export', content);
    backendApi.pages.save('export', content);
  },

  getTeamPage: (): TeamPageContent => getStored('page_team', INITIAL_TEAMPAGE),
  saveTeamPage: (content: TeamPageContent) => {
    setStored('page_team', content);
    backendApi.pages.save('team', content);
  },

  getContactPage: (): ContactPageContent => getStored('page_contact', INITIAL_CONTACTPAGE),
  saveContactPage: (content: ContactPageContent) => {
    setStored('page_contact', content);
    backendApi.pages.save('contact', content);
  },

  getSiteGlobal: (): SiteGlobalContent => getStored('site_global', INITIAL_SITEGLOBAL),
  saveSiteGlobal: (content: SiteGlobalContent) => {
    setStored('site_global', content);
    backendApi.pages.save('site', content);
  },

  // Operational & Generic
  getLeads: (): LeadApplication[] => getStored('leads', INITIAL_LEADS),
  saveLeads: (leads: LeadApplication[]) => setStored('leads', leads),
};
