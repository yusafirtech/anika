export type TeamMember = {
  id: string;
  name: string;
  title: string;
  department: string;
  image: string | null;
  gradient: string;
  initials: string;
  bio: string;
  expertise: string[];
};

export const teamMembers: TeamMember[] = [
  {
    id: "md-anika",
    name: "Md. Anisur Rahman",
    title: "Founder & Managing Director",
    department: "Executive Leadership",
    image: "/images/team-ceo.jpg",
    gradient: "from-navy to-navy-dark",
    initials: "AR",
    bio: "Md. Anisur Rahman founded ANIKA TRADING & CO. with a clear vision: to build a diversified business company capable of operating across multiple high-value sectors in Bangladesh and beyond. With over 15 years of experience spanning construction, government procurement, supply chain management, and international trade, he has grown the company from a local construction firm into a multi-sector enterprise with active export operations. His leadership philosophy centers on disciplined growth — entering each new sector only when the capability to serve it well is genuinely in place.",
    expertise: [
      "Strategic Business Development",
      "Government Procurement & Tendering",
      "Construction Project Management",
      "International Trade & Export",
      "Multi-sector Business Operations",
    ],
  },
  {
    id: "rafiqul-islam",
    name: "Rafiqul Islam",
    title: "Director of Operations",
    department: "Operations",
    image: "/images/team-director-ops.jpg",
    gradient: "from-navy to-teal",
    initials: "RI",
    bio: "Rafiqul Islam oversees the operational backbone of ANIKA'\''s business — from site execution and procurement logistics to vendor management and project coordination. With a decade of field-level and management experience, he bridges the gap between senior strategy and on-the-ground delivery. He joined ANIKA during its expansion into government and institutional supply, and has since built the systems and team structures that allow the company to run multiple concurrent operations reliably.",
    expertise: [
      "Supply Chain & Logistics",
      "Project Site Coordination",
      "Vendor & Procurement Management",
      "Team Operations & Resourcing",
      "Quality Control Systems",
    ],
  },
  {
    id: "farhana-hossain",
    name: "Farhana Hossain",
    title: "Head of Export & International Trade",
    department: "Export Division",
    image: "/images/team-export-head.jpg",
    gradient: "from-teal to-violet",
    initials: "FH",
    bio: "Farhana Hossain leads ANIKA'\''s international export division, managing relationships with overseas buyers, coordinating documentation and compliance, and overseeing product sourcing for cross-border trade. She has established the export processes, buyer networks, and sourcing partnerships that allow the company to serve markets across the Middle East, Southeast Asia, and beyond. Her focus is on building long-term buyer relationships rather than one-off transactions.",
    expertise: [
      "International Trade Documentation",
      "Buyer Relationship Management",
      "Export Compliance & Regulation",
      "Agricultural & Seafood Export",
      "Cross-border Logistics",
    ],
  },
  {
    id: "kamal-hasan",
    name: "Kamal Hasan",
    title: "Chief Financial Officer",
    department: "Finance",
    image: null,
    gradient: "from-navy-dark to-navy",
    initials: "KH",
    bio: "Kamal Hasan manages ANIKA'\''s financial planning, reporting, compliance, and treasury operations. With a background in corporate finance and a strong command of Bangladesh'\''s regulatory and tax environment, he provides the financial discipline that underpins the company'\''s growth strategy. He works closely with the MD and department heads to ensure each business unit operates within clearly defined financial parameters, and that capital is allocated where it generates the strongest long-term return.",
    expertise: [
      "Financial Planning & Analysis",
      "Treasury & Cash Flow Management",
      "Tax & Regulatory Compliance",
      "Business Due Diligence",
      "Cost & Margin Optimization",
    ],
  },
  {
    id: "tahmina-begum",
    name: "Tahmina Begum",
    title: "Head of Government Supply & Tendering",
    department: "Government Relations",
    image: null,
    gradient: "from-teal to-navy-dark",
    initials: "TB",
    bio: "Tahmina Begum manages ANIKA'\''s engagement with government procurement processes — identifying tender opportunities, preparing documentation, building institutional relationships, and ensuring specifications are met with precision. She has developed a detailed understanding of Bangladesh'\''s public procurement frameworks and has led the company'\''s successful participation in tenders across healthcare, infrastructure, and education sectors.",
    expertise: [
      "Government Tender Management",
      "Public Procurement Compliance",
      "Institutional Relationship Building",
      "Documentation & Specification Review",
      "Contract Negotiation & Execution",
    ],
  },
  {
    id: "jahangir-alam",
    name: "Jahangir Alam",
    title: "Head of Construction & Projects",
    department: "Construction",
    image: null,
    gradient: "from-violet to-navy",
    initials: "JA",
    bio: "Jahangir Alam leads ANIKA'\''s construction and civil project operations — from planning and materials procurement to subcontractor coordination and client handover. A civil engineer by training with extensive site experience, he brings technical credibility and practical leadership to the company'\''s project execution. Under his oversight, ANIKA has delivered infrastructure, commercial, and institutional projects across Bangladesh, consistently meeting specification and timeline requirements.",
    expertise: [
      "Civil Engineering & Project Delivery",
      "Construction Site Management",
      "Subcontractor Coordination",
      "Materials Procurement & Specification",
      "Infrastructure & Commercial Builds",
    ],
  },
];

export const departments = [
  "All",
  "Executive Leadership",
  "Operations",
  "Export Division",
  "Finance",
  "Government Relations",
  "Construction",
];
