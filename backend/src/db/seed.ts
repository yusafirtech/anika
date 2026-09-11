import bcrypt from 'bcryptjs';
import { getPool } from './connection.js';

// Default CMS Data for all 8 pages
const INITIAL_HOMEPAGE = {
  hero: {
    badgeText: 'One Company · Multiple Sectors · One Connected Business',
    keywords: ['Building.', 'Supplying.', 'Exporting.', 'Connecting.'],
    headline: 'Operating Across High-Value Sectors in Bangladesh and Beyond',
    subheadline:
      'ANIKA TRADING & CO. operates across high-value sectors — connecting Bangladesh capabilities with projects, supply chains and international markets.',
    primaryCtaText: 'START A CONVERSATION',
    primaryCtaLink: '/contact',
    secondaryCtaText: 'EXPLORE EXPORT PRODUCTS',
    secondaryCtaLink: '/export',
    bgImage: '/images/hero-port-supply-route.jpg',
  },
  sectorStories: [
    {
      id: 'seafood',
      index: '01',
      category: 'Export Capability',
      badge: 'Cold-Chain Certified',
      title: 'Seafood Export',
      description:
        'Sourcing, processing coordination and export of fresh and frozen seafood from Bangladesh to international buyers with strict temperature monitoring.',
      image: '/images/story-seafood.jpg',
      href: '/export',
    },
    {
      id: 'agriculture',
      index: '02',
      category: 'Agri Division',
      badge: 'Origin Sourced',
      title: 'Agricultural Products',
      description:
        'Fresh vegetables, produce and agro commodities from fertile agricultural belts prepared and packaged to international export standards.',
      image: '/images/story-agriculture-origin.jpg',
      href: '/export',
    },
    {
      id: 'construction',
      index: '03',
      category: 'Infrastructure',
      badge: 'Heavy Execution',
      title: 'Construction & Projects',
      description:
        'On-site project execution, structural coordination and materials supply for infrastructure and commercial development.',
      image: '/images/story-construction-site.jpg',
      href: '/projects',
    },
    {
      id: 'government-supply',
      index: '04',
      category: 'Institutional Supply',
      badge: 'Tender Compliant',
      title: 'Government Supply',
      description:
        'Structured supply and procurement fulfillment for government and institutional tenders across Bangladesh.',
      image: '/images/story-institutional-supply.jpg',
      href: '/business',
    },
    {
      id: 'distribution',
      index: '05',
      category: 'Commercial Supply',
      badge: 'B2B Logistics',
      title: 'Supply & Distribution',
      description:
        'Commercial and wholesale distribution connecting producers, distributors and enterprise buyers.',
      image: '/images/story-business-network.jpg',
      href: '/business',
    },
    {
      id: 'trade',
      index: '06',
      category: 'International Commerce',
      badge: 'Cross-Border',
      title: 'Import & Trading',
      description:
        'Connecting Bangladesh business capabilities with international trade networks and sourcing routes.',
      image: '/images/story-international-trade.jpg',
      href: '/business',
    },
  ],
  businessShowcase: [
    {
      id: 'infrastructure',
      index: '01',
      title: 'Infrastructure & Project Delivery',
      description:
        'From ground-up civil engineering execution to specialized institutional procurement fulfillment.',
      image: '/images/story-infrastructure.jpg',
    },
    {
      id: 'seafood-coldchain',
      index: '02',
      title: 'Seafood & Cold Chain Logistics',
      description:
        'Continuous temperature monitoring and export packaging designed for wholesale global distributors.',
      image: '/images/story-seafood-closeup.jpg',
    },
    {
      id: 'agri-produce',
      index: '03',
      title: 'Agricultural Origin Sourcing',
      description:
        'Direct partnerships with grower collectives across Rangpur, Jessore and Bogra belts for export-grade yield.',
      image: '/images/story-vegetable-market.jpg',
    },
    {
      id: 'supply-network',
      index: '04',
      title: 'Institutional Supply Networks',
      description:
        'High-volume materials logistics for bridges, highways, power plants and government tender packages.',
      image: '/images/hero-heavy-construction.jpg',
    },
  ],
  projectStories: [
    {
      id: 'padma-rail',
      index: '01',
      category: 'Infrastructure',
      title: 'Padma Rail Link Supply',
      description:
        'Heavy reinforcement logistics, high-grade aggregate supply and site deliveries along the southern corridor.',
      image: '/images/story-construction-site.jpg',
    },
    {
      id: 'chittagong-cold',
      index: '02',
      category: 'Industrial',
      title: 'Chittagong Cold Storage Facility',
      description:
        'Turnkey HVAC, reefer dock staging and -25°C rapid blast freezing installations for marine cargo.',
      image: '/images/story-seafood.jpg',
    },
    {
      id: 'dhaka-elevated',
      index: '03',
      category: 'Government Supply',
      title: 'Dhaka Elevated Expressway Logistics',
      description:
        'Round-the-clock structural cement, pre-cast beam coordination and safety gear bulk distribution.',
      image: '/images/story-infrastructure.jpg',
    },
    {
      id: 'coastal-embankment',
      index: '04',
      category: 'Engineering',
      title: 'Coastal Embankment Protection',
      description:
        'Geotextile bags, rock boulder transport and riverbank stabilization along the Meghna estuary.',
      image: '/images/story-business-network.jpg',
    },
  ],
  whyReasons: [
    {
      id: 'multi-sector',
      index: '01',
      title: 'Multi-Sector Capability',
      description:
        'ANIKA operates across export, seafood, agricultural products, construction, supply and trading — one organization, several connected capabilities.',
      image: '/images/story-business-network.jpg',
    },
    {
      id: 'supply-execution',
      index: '02',
      title: 'Supply & Execution',
      description:
        'Capability extends beyond sourcing to supply, coordination and project execution, from first order to final delivery.',
      image: '/images/story-institutional-supply.jpg',
    },
    {
      id: 'bangladesh-advantage',
      index: '03',
      title: 'Bangladesh-Based Advantage',
      description:
        'Connecting international opportunities with Bangladesh-based products, suppliers and business capabilities.',
      image: '/images/story-agriculture-origin.jpg',
    },
    {
      id: 'international-focus',
      index: '04',
      title: 'International Business Focus',
      description:
        'Built to connect Bangladesh-origin products and capabilities with international buyers and partners.',
      image: '/images/story-global-connection.jpg',
    },
    {
      id: 'partnership-mindset',
      index: '05',
      title: 'Partnership Mindset',
      description:
        'A focus on long-term business relationships rather than one-off transactions, on every side of the business.',
      image: '/images/why-anika-collaboration.jpg',
    },
    {
      id: 'one-business',
      index: '06',
      title: 'One Connected Business',
      description:
        'Multiple business capabilities under one organization, coordinated rather than siloed.',
      image: '/images/story-infrastructure.jpg',
    },
  ],
  cta: {
    eyebrow: 'Business Inquiry',
    heading: 'Let’s Build the Next Opportunity Together.',
    description:
      'Whether you are looking for products from Bangladesh, exploring a supply requirement, discussing a project or seeking a business partnership, talk to ANIKA.',
    primaryCtaText: 'START A CONVERSATION',
    primaryCtaLink: '/contact',
    secondaryCtaText: 'EXPLORE EXPORT PRODUCTS',
    secondaryCtaLink: '/export',
    bgImage: '/images/final-cta-port.jpg',
  },
};

const INITIAL_ABOUTPAGE = {
  intro: {
    eyebrow: 'About ANIKA TRADING & CO.',
    heading: 'Built to Connect Capabilities Across Sectors',
    leadText:
      'ANIKA TRADING & CO. was founded with a singular conviction: that a modern business company in Bangladesh can achieve far greater impact by bridging high-value sectors rather than operating in isolation.',
    bodyText:
      'From our origins in construction and project coordination to expanding into government procurement, private-sector distribution, and global export markets, we have built an infrastructure grounded in reliability, strict compliance, and execution discipline.',
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
      description:
        'ANIKA began as a Bangladesh-based business company, built to operate across more than one sector rather than specialize narrowly in one.',
      image: '/images/materials-detail.jpg',
    },
    {
      id: 'construction',
      label: 'CONSTRUCTION',
      title: 'Building Project Execution Capability',
      description:
        'Construction and project work established the company’s discipline around coordination, materials and on-site delivery.',
      image: '/images/story-construction-site.jpg',
    },
    {
      id: 'supply',
      label: 'SUPPLY',
      title: 'Extending into Government & Institutional Supply',
      description:
        'That execution capability extended naturally into government and institutional supply, where scale and specification matter as much as delivery.',
      image: '/images/story-institutional-supply.jpg',
    },
    {
      id: 'distribution',
      label: 'DISTRIBUTION',
      title: 'Building a Distribution Network',
      description:
        'Distribution and private-sector supply work grew the company’s network of business relationships across Bangladesh.',
      image: '/images/story-business-network.jpg',
    },
    {
      id: 'trading',
      label: 'TRADING',
      title: 'Import & Trading Operations',
      description:
        'Import and trading operations connected ANIKA to a wider set of suppliers, products and business partners.',
      image: '/images/trade-detail.jpg',
    },
    {
      id: 'export',
      label: 'EXPORT',
      title: 'Reaching International Markets',
      description:
        'Today, that same foundation supports international export — connecting Bangladesh-origin products with buyers abroad.',
      image: '/images/story-international-trade.jpg',
    },
  ],
  missionVision: {
    missionTitle: 'Our Mission',
    missionText:
      'To connect Bangladesh’s resources, manpower, and production capabilities with domestic infrastructure demands and international markets through rigorous quality control and trustworthy partnerships.',
    visionTitle: 'Our Vision',
    visionText:
      'To be Bangladesh’s premier multi-sector trading and execution conglomerate, recognized internationally for transparency, high standards, and scalable B2B trade partnerships.',
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
    { id: 'discipline', label: 'EXECUTION DISCIPLINE', description: 'Disciplined coordination from order to delivery.' },
    { id: 'transparency', label: 'TRANSPARENCY', description: 'Clear documentation, open communication.' },
    { id: 'standards', label: 'HIGH STANDARDS', description: 'Meeting specifications without compromise.' },
    { id: 'longevity', label: 'LONG-TERM VISION', description: 'Building relationships that compound over time.' },
  ],
  philosophy: {
    quote:
      'We do not believe a company should be defined by a single transaction. We measure our worth by the trust that brings clients back to ANIKA year after year.',
    narrative:
      'Whether mobilizing structural steel on an infrastructure site or dispatching a reefer container of Black Tiger shrimp across the Atlantic, our underlying philosophy remains identical: respect the agreement, respect the schedule, and respect the quality benchmark.',
    authorName: 'Md. Anisur Rahman',
    authorTitle: 'Founder & Managing Director, ANIKA TRADING & CO.',
    image: '/images/team-ceo.jpg',
  },
};

const INITIAL_BUSINESSPAGE = {
  intro: {
    eyebrow: 'Business Verticals',
    heading: 'Six Operational Sectors. One Connected Company.',
    description:
      'ANIKA operates across six distinct business lines — each developed with domain knowledge, supplier relationships, and operational discipline.',
  },
  verticals: [
    {
      id: 'construction',
      index: '01',
      title: 'Construction & Infrastructure Projects',
      eyebrow: 'Execution Capability',
      description:
        'On-site execution, coordination and management of civil and commercial construction projects.',
      capabilities: [
        'Civil and commercial building construction',
        'Infrastructure and earthworks coordination',
        'On-site project management and labor coordination',
        'Subcontracting and multi-party coordination',
        'Quality assurance and milestone delivery',
      ],
      cta: 'DISCUSS A PROJECT',
      image: '/images/story-construction-site.jpg',
      layout: 'side',
    },
    {
      id: 'government-supply',
      index: '02',
      title: 'Government & Institutional Supply',
      eyebrow: 'Procurement & Supply',
      description:
        'Procurement and supply fulfillment for government bodies, departments and public-sector tenders.',
      capabilities: [
        'Tender-compliant sourcing and supply',
        'Institutional procurement fulfillment',
        'Specification compliance and documentation',
        'Scheduled delivery and logistics management',
        'Public-sector vendor registration and compliance',
      ],
      cta: 'SUBMIT A TENDER INQUIRY',
      image: '/images/story-institutional-supply.jpg',
      layout: 'reverse',
    },
    {
      id: 'private-supply',
      index: '03',
      title: 'Private Sector Supply & Distribution',
      eyebrow: 'Supply & Distribution',
      description:
        'Supply and distribution to businesses, contractors, retailers and commercial operations.',
      capabilities: [
        'B2B product supply and distribution',
        'Bulk materials procurement for contractors',
        'Commercial distribution network management',
        'Flexible order volumes and regular delivery schedules',
      ],
      cta: 'EXPLORE SUPPLY OPTIONS',
      image: '/images/story-business-network.jpg',
      layout: 'side',
    },
    {
      id: 'trading',
      index: '04',
      title: 'Import & General Trading',
      eyebrow: 'Trading Operations',
      description:
        'Import and trading of commodities, industrial materials, goods and products into Bangladesh.',
      capabilities: [
        'Commodity and materials import',
        'Customs clearance and import logistics coordination',
        'Local market distribution of imported products',
        'Trade finance and transaction coordination',
      ],
      cta: 'EXPLORE TRADING PARTNERSHIP',
      image: '/images/trade-detail.jpg',
      layout: 'reverse',
    },
    {
      id: 'export-division',
      index: '05',
      title: 'Export Operations',
      eyebrow: 'International Export',
      description:
        'Connecting Bangladesh-origin products with international buyers across seafood, agriculture and other goods.',
      capabilities: [
        'Fresh and frozen seafood sourcing and export',
        'Fresh vegetables and agricultural produce export',
        'Cold-chain logistics and quality management',
        'International trade documentation and compliance',
      ],
      cta: 'VIEW EXPORT PRODUCTS',
      image: '/images/story-seafood.jpg',
      layout: 'side',
    },
    {
      id: 'partnership',
      index: '06',
      title: 'Business Partnerships & Representation',
      eyebrow: 'Representation & Joint Ventures',
      description:
        'Partnering with foreign companies and investors seeking reliable local execution in Bangladesh.',
      capabilities: [
        'Local partner for foreign companies entering Bangladesh',
        'Joint venture project representation',
        'Local market knowledge, relationships and navigation',
        'Project coordination on behalf of overseas principals',
      ],
      cta: 'EXPLORE PARTNERSHIP',
      image: '/images/why-anika-collaboration.jpg',
      layout: 'banner',
    },
  ],
};

const INITIAL_PROJECTSPAGE = {
  intro: {
    eyebrow: 'Track Record & Projects',
    heading: 'Delivering Across Construction, Supply & Infrastructure',
    description:
      'A record of delivery across multiple sectors — from structural works to supply contracts and international trade fulfillment.',
  },
  projects: [
    {
      slug: 'structural-steel-procurement',
      name: 'Structural Steel Procurement & Supply',
      category: 'Supply',
      location: 'Dhaka, Bangladesh',
      year: '2025',
      status: 'Completed',
      summary:
        'Large-scale structural steel sourcing and phased delivery for a major commercial development in Dhaka.',
      overview:
        'ANIKA coordinated the sourcing, specification compliance, and delivery schedule for over 1,200 metric tons of certified structural steel. Delivered on time across a four-month phased schedule.',
      scope: [
        '1,200 MT certified structural steel procurement',
        'Mill test certificates and third-party quality verification',
        'Phased delivery schedule coordinated with on-site staging',
        'Zero-delay fulfillment across 4 delivery tranches',
      ],
      execution:
        'Coordinated directly between primary steel mills and the client engineering team, managing logistical staging to prevent site congestion while maintaining required on-site stock levels.',
      image: '/images/hero-heavy-construction.jpg',
    },
    {
      slug: 'institutional-food-grain-supply',
      name: 'Institutional Grain & Food Supply Contract',
      category: 'Supply',
      location: 'Chittagong Division, Bangladesh',
      year: '2024',
      status: 'Completed',
      summary:
        'Government-level supply contract for bulk food grain sourcing, quality verification, and distribution.',
      overview:
        'Fulfilled a competitive institutional tender contract for bulk agricultural commodity supply, meeting strict moisture, purity, and delivery window specifications across multiple receiving depots.',
      scope: [
        'Bulk sourcing from verified agricultural origins',
        'Moisture, purity, and grade testing per tender specifications',
        'Multi-depot logistics and scheduled delivery coordination',
        'Complete regulatory documentation and compliance sign-off',
      ],
      execution:
        'Deployed dedicated quality verification teams at origin collection points to inspect consignments prior to dispatch, ensuring 100% acceptance rate at receiving depots.',
      image: '/images/story-vegetable-market.jpg',
    },
    {
      slug: 'industrial-warehouse-civil-works',
      name: 'Industrial Warehouse & Logistics Facility Civil Works',
      category: 'Construction',
      location: 'Gazipur, Dhaka Division, Bangladesh',
      year: '2024',
      status: 'Completed',
      summary:
        'Civil works, foundation construction, and structural coordination for a 45,000 sq ft logistics facility.',
      overview:
        'Full civil works contract covering site preparation, deep piling, reinforced concrete foundation, and super-structure coordination for a commercial logistics warehouse facility.',
      scope: [
        'Site clearing, grading, and earthworks',
        'Cast-in-situ reinforced concrete piling and foundation',
        'Structural steel frame coordination and erection support',
        'Heavy-duty industrial floor slab casting and finishing',
      ],
      execution:
        'Managed on-site workforce of over 80 personnel, maintaining safety compliance and quality standards through monsoon season to deliver within the agreed 7-month project window.',
      image: '/images/story-construction-site.jpg',
    },
    {
      slug: 'frozen-seafood-export-consignment',
      name: 'Frozen Seafood Export Consignments — Middle East',
      category: 'Infrastructure',
      location: 'Chittagong Port to UAE & Saudi Arabia',
      year: '2024–2025',
      status: 'Ongoing',
      summary:
        'Regular export consignments of graded frozen fish and shrimp to wholesale buyers in Gulf markets.',
      overview:
        'Multi-consignment export program delivering containerized frozen seafood from Bangladesh processing plants to importers in Dubai, Dammam, and Jeddah.',
      scope: [
        'Sourcing from approved coastal aquaculture and marine catch processors',
        'Continuous cold-chain management from processing to port of destination',
        'Phytosanitary, health certificate, and origin documentation',
        'Reefer container booking, loading inspection, and port clearance',
      ],
      execution:
        'Direct relationship management with export buyers combined with on-the-ground presence at Chittagong port ensure documentation and cold chain integrity are maintained without exception.',
      image: '/images/story-seafood.jpg',
    },
  ],
};

const INITIAL_EXPORTPAGE = {
  intro: {
    eyebrow: 'Export Division',
    heading: 'Connecting Bangladesh Products with Global Markets',
    description:
      'ANIKA TRADING & CO. sources, processes, and exports Bangladesh-origin seafood and agricultural commodities to international buyers.',
  },
  categories: [
    { id: 'seafood', label: 'Frozen & Fresh Seafood', image: '/images/story-seafood.jpg' },
    { id: 'fish', label: 'Fresh & Frozen Fish', image: '/images/story-seafood-closeup.jpg' },
    { id: 'vegetables', label: 'Fresh Vegetables & Produce', image: '/images/story-vegetable-market.jpg' },
    { id: 'agriculture', label: 'Agricultural Commodities', image: '/images/story-agriculture-origin.jpg' },
  ],
  process: [
    { step: 'Origin Sourcing', description: 'Direct sourcing from verified coastal hatcheries, river catch, and farming belts.' },
    { step: 'Grading & Inspection', description: 'Rigorous grading by size, weight, and freshness to meet international standards.' },
    { step: 'Processing & Packaging', description: 'IQF, block freeze, and export master cartons prepared to buyer specifications.' },
    { step: 'Cold Chain Storage', description: '-18°C to -25°C continuous cold chain storage from processing to dispatch.' },
    { step: 'Documentation & Compliance', description: 'Health certificates, phytosanitary clearance, and Certificate of Origin.' },
    { step: 'Port Logistics & Shipment', description: 'Reefer container staging and vessel loading through Chittagong Port.' },
  ],
  products: [
    {
      slug: 'black-tiger-shrimp',
      name: 'Black Tiger Shrimp (Penaeus monodon)',
      category: 'Seafood',
      origin: 'Bangladesh (Coastal Bay of Bengal)',
      availability: 'Year-round',
      moq: '1 x 20ft Reefer FCL (approx. 12,000 kg)',
      summary: 'Export-grade Black Tiger shrimp sourced from Bangladesh coastal waters, graded, processed, and packed for international buyers.',
      image: '/images/story-seafood.jpg',
      images: [
        '/images/story-seafood.jpg',
        '/images/story-seafood-closeup.jpg',
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

const INITIAL_TEAMPAGE = {
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
      bio: 'Md. Anisur Rahman founded ANIKA TRADING & CO. with a clear vision: to build a diversified business company capable of operating across multiple high-value sectors in Bangladesh and beyond.',
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

const INITIAL_CONTACTPAGE = {
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

const INITIAL_SITEGLOBAL = {
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
        { label: 'Partners', href: '/partners' },
        { label: 'Insights & News', href: '/insights' },
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

const INITIAL_LEADS = [
  {
    id: 'lead-1',
    name: 'Tariq Al-Mansoor',
    company: 'Gulf Horizon Trading LLC',
    email: 'tariq@gulfhorizon.ae',
    phone: '+971 4 882 1920',
    sector: 'Seafood',
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
    status: 'Reviewing',
    budget: '$80,000 - $120,000',
    message: 'Inquiring about organic potato and fresh vegetable cargo freight schedules from Chittagong port to Rotterdam.',
    notes: 'Reviewed preliminary packing standards.',
    createdAt: '2026-09-05T14:30:00Z',
  },
];

const INITIAL_PARTNER_ITEMS = [
  {
    id: 'part-1',
    name: 'Gulf Horizon Trading Group',
    category: 'Buyer',
    country: 'United Arab Emirates',
    partnershipYear: 2021,
    status: 'Active',
    logo: '/images/story-business-network.jpg',
  },
  {
    id: 'part-2',
    name: 'Rotterdam Fresh Cargo B.V.',
    category: 'Logistics Partner',
    country: 'Netherlands',
    partnershipYear: 2023,
    status: 'Active',
    logo: '/images/story-global-connection.jpg',
  },
];

export async function seedInitialData(): Promise<void> {
  const pool = getPool();
  console.log('[MySQL] Checking if initial seed data is required...');

  // 1. Seed pages_content
  const pageEntries: [string, any][] = [
    ['home', INITIAL_HOMEPAGE],
    ['about', INITIAL_ABOUTPAGE],
    ['business', INITIAL_BUSINESSPAGE],
    ['projects', INITIAL_PROJECTSPAGE],
    ['export', INITIAL_EXPORTPAGE],
    ['team', INITIAL_TEAMPAGE],
    ['contact', INITIAL_CONTACTPAGE],
    ['site', INITIAL_SITEGLOBAL],
  ];

  for (const [key, content] of pageEntries) {
    const [rows]: any = await pool.query(
      'SELECT page_key FROM pages_content WHERE page_key = ? LIMIT 1',
      [key]
    );
    if (!rows || rows.length === 0) {
      await pool.query(
        'INSERT INTO pages_content (page_key, content) VALUES (?, ?)',
        [key, JSON.stringify(content)]
      );
      console.log(`[MySQL Seed] Seeded page: ${key}`);
    }
  }

  // 2. Seed default users
  const [userRows]: any = await pool.query('SELECT id FROM users LIMIT 1');
  if (!userRows || userRows.length === 0) {
    const adminHash = await bcrypt.hash('admin123', 10);
    const managerHash = await bcrypt.hash('manager123', 10);

    await pool.query(
      `INSERT INTO users (id, username, name, email, password_hash, role, department, status, last_active) VALUES
       (?, ?, ?, ?, ?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'usr-1',
        'admin',
        'Managing Director',
        'admin@anikatrading.com',
        adminHash,
        'admin',
        'Executive Management',
        'active',
        'Just now',

        'usr-2',
        'manager',
        'Operations Manager',
        'operations@anikatrading.com',
        managerHash,
        'manager',
        'Supply & Logistics',
        'active',
        '2 hours ago',
      ]
    );
    console.log('[MySQL Seed] Seeded default admin users (admin@anikatrading.com / admin123).');
  }

  // 3. Seed initial leads
  const [leadRows]: any = await pool.query('SELECT id FROM leads LIMIT 1');
  if (!leadRows || leadRows.length === 0) {
    for (const lead of INITIAL_LEADS) {
      await pool.query(
        `INSERT INTO leads (id, name, company, email, phone, sector, status, budget, message, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lead.id,
          lead.name,
          lead.company,
          lead.email,
          lead.phone,
          lead.sector,
          lead.status,
          lead.budget,
          lead.message,
          lead.notes,
          new Date(lead.createdAt).toISOString().slice(0, 19).replace('T', ' '),
        ]
      );
    }
    console.log('[MySQL Seed] Seeded initial trade leads.');
  }

  // 4. Seed generic content collections (Partners)
  const collectionEntries: [string, any[]][] = [['partners', INITIAL_PARTNER_ITEMS]];

  for (const [key, items] of collectionEntries) {
    const [rows]: any = await pool.query(
      'SELECT collection_key FROM content_collections WHERE collection_key = ? LIMIT 1',
      [key]
    );
    if (!rows || rows.length === 0) {
      await pool.query(
        'INSERT INTO content_collections (collection_key, items) VALUES (?, ?)',
        [key, JSON.stringify(items)]
      );
      console.log(`[MySQL Seed] Seeded collection: ${key}`);
    }
  }

  // 5. Seed a couple of sample clients
  const [clientRows]: any = await pool.query('SELECT id FROM clients LIMIT 1');
  if (!clientRows || clientRows.length === 0) {
    await pool.query(
      `INSERT INTO clients (id, name, contact_person, email, phone, address, sector, status, logo, client_since, notes) VALUES
       (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'client-1',
        'Gulf Horizon Trading LLC',
        'Tariq Al-Mansoor',
        'tariq@gulfhorizon.ae',
        '+971 4 882 1920',
        'Dubai, United Arab Emirates',
        'Seafood',
        'Active',
        null,
        '2022-03-01',
        'Recurring bulk shrimp buyer, quarterly containers.',

        'client-2',
        'EuroAsia Logistics BV',
        'Marcus Vance',
        'm.vance@euroasialog.nl',
        '+31 20 592 3311',
        'Rotterdam, Netherlands',
        'Agriculture',
        'Prospect',
        null,
        null,
        'In discussion for a fresh vegetable freight contract.',
      ]
    );
    console.log('[MySQL Seed] Seeded sample clients.');
  }

  // 6. Seed sample insights so the homepage section isn't empty on first run
  const [insightRows]: any = await pool.query('SELECT id FROM insights LIMIT 1');
  if (!insightRows || insightRows.length === 0) {
    for (const insight of INITIAL_INSIGHTS) {
      await pool.query(
        `INSERT INTO insights
          (id, slug, title, category, excerpt, content, cover_image, related_product_slug, author,
           status, featured, published_at, meta_title, meta_description, keywords)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?)`,
        [
          insight.id,
          insight.slug,
          insight.title,
          insight.category,
          insight.excerpt,
          insight.content,
          insight.coverImage,
          insight.relatedProductSlug,
          insight.author,
          insight.featured ? 1 : 0,
          insight.publishedAt,
          insight.metaTitle,
          insight.metaDescription,
          insight.keywords,
        ]
      );
    }
    console.log('[MySQL Seed] Seeded sample insights.');
  }

  console.log('[MySQL] Seeding complete.');
}

const INITIAL_INSIGHTS = [
  {
    id: 'insight-1',
    slug: 'bangladesh-shrimp-exports-demand-outlook',
    title: 'Bangladesh Shrimp Exports: What Buyers Should Expect This Season',
    category: 'Product News',
    excerpt:
      'Demand for Bangladesh-origin black tiger shrimp is climbing in the Gulf and EU. Here is what importers should plan for on grading, cold chain, and lead times.',
    content: [
      'Black tiger shrimp from Bangladesh’s coastal belt continues to draw strong interest from importers in the Gulf and the European Union, driven by consistent grading and competitive landed costs.',
      '## What is driving demand',
      '- Retail chains are expanding frozen seafood ranges year-round',
      '- Buyers are diversifying origin away from single-country dependence',
      '- Improved cold chain capacity at Chittagong and Mongla ports',
      '## Planning your order',
      'Most buyers secure allocations four to six weeks ahead of shipment. Confirming count size, glazing percentage, and packaging format early keeps processing on schedule and avoids last-minute substitutions.',
      'ANIKA works with certified processing partners and can share current availability, specifications, and documentation on request.',
    ].join('\n\n'),
    coverImage: '/images/story-seafood-closeup.jpg',
    relatedProductSlug: 'black-tiger-shrimp',
    author: 'ANIKA Export Desk',
    featured: true,
    publishedAt: '2026-09-02 09:00:00',
    metaTitle: 'Bangladesh Black Tiger Shrimp Export Outlook | ANIKA TRADING & CO.',
    metaDescription:
      'Demand outlook for Bangladesh black tiger shrimp exports — grading, cold chain, lead times, and how importers should plan orders this season.',
    keywords: 'bangladesh shrimp export, black tiger shrimp supplier, frozen shrimp importer, seafood export bangladesh',
  },
  {
    id: 'insight-2',
    slug: 'agricultural-export-logistics-chittagong-port',
    title: 'Moving Fresh Produce Through Chittagong: A Practical Logistics Guide',
    category: 'Industry News',
    excerpt:
      'Reefer availability, phytosanitary paperwork, and transit planning — the practical steps that decide whether fresh produce arrives market-ready.',
    content: [
      'Fresh vegetables and agricultural produce are only as valuable as their condition on arrival. For shipments leaving Chittagong, three factors matter most.',
      '## Reefer capacity',
      'Reefer container availability tightens during peak harvest months. Booking early and confirming pre-cooling at the packhouse protects shelf life.',
      '## Documentation',
      '- Phytosanitary certificate issued before loading',
      '- Certificate of origin matched to the commercial invoice',
      '- Importer-specific residue or grading reports where required',
      '## Transit planning',
      'Direct sailings reduce handling and temperature excursions. Where transshipment is unavoidable, choosing hubs with reliable reefer plug-in capacity makes a measurable difference.',
    ].join('\n\n'),
    coverImage: '/images/story-vegetable-market.jpg',
    relatedProductSlug: 'fresh-vegetables',
    author: 'ANIKA Logistics Team',
    featured: false,
    publishedAt: '2026-08-24 10:30:00',
    metaTitle: 'Fresh Produce Export Logistics from Chittagong Port | ANIKA',
    metaDescription:
      'A practical guide to exporting fresh vegetables from Chittagong — reefer booking, phytosanitary documentation, and transit planning.',
    keywords: 'chittagong port export, fresh vegetable export bangladesh, reefer container, phytosanitary certificate',
  },
  {
    id: 'insight-3',
    slug: 'anika-expands-institutional-supply-capacity',
    title: 'ANIKA Expands Institutional Supply Capacity Across Construction and Food Grain',
    category: 'Company News',
    excerpt:
      'New supplier partnerships and warehousing capacity let ANIKA take on larger government and institutional supply contracts.',
    content: [
      'ANIKA TRADING & CO. has expanded its institutional supply capacity, adding warehousing and new supplier partnerships to support larger government and private-sector contracts.',
      'The expansion covers construction materials and food grain supply, two areas where specification compliance and delivery reliability are critical.',
      '## What this means for partners',
      '- Shorter lead times on recurring institutional orders',
      '- Larger single-contract volumes',
      '- Consistent documentation and specification compliance',
      'Organizations with upcoming supply requirements can contact the ANIKA team to discuss scope, timelines, and specifications.',
    ].join('\n\n'),
    coverImage: '/images/story-institutional-supply.jpg',
    relatedProductSlug: null,
    author: 'ANIKA Communications',
    featured: false,
    publishedAt: '2026-08-12 08:00:00',
    metaTitle: 'ANIKA Expands Institutional Supply Capacity | ANIKA TRADING & CO.',
    metaDescription:
      'ANIKA TRADING & CO. expands warehousing and supplier partnerships to support larger government and institutional supply contracts in Bangladesh.',
    keywords: 'institutional supply bangladesh, government tender supplier, construction materials supply, food grain supply',
  },
];
