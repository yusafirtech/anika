export type Project = {
  slug: string;
  name: string;
  category: "Construction" | "Supply";
  location: string;
  year: string;
  status: string;
  summary: string;
  overview: string;
  scope: string[];
  execution: string;
  image: string;
};

export const projects: Project[] = [
  {
    slug: "infrastructure-environment",
    name: "Infrastructure & Environment",
    category: "Construction",
    location: "Bangladesh",
    year: "[Year to be confirmed]",
    status: "In Progress",
    summary:
      "Infrastructure-scale project work spanning site engineering, materials coordination and phased execution.",
    overview:
      "This project reflects ANIKA's capability to take on infrastructure-scale work that requires coordination across engineering, materials and site teams over an extended timeline.",
    scope: ["Site engineering coordination", "Materials sourcing & logistics", "Phased project execution"],
    execution:
      "Work is coordinated in phases, with materials and manpower scheduled against site milestones as the project progresses.",
    image: "/images/project-bridge.jpg",
  },
  {
    slug: "building-construction",
    name: "Building Construction",
    category: "Construction",
    location: "Bangladesh",
    year: "[Year to be confirmed]",
    status: "In Progress",
    summary:
      "Ground-up building construction, coordinated across structural, material and manpower requirements.",
    overview:
      "A ground-up construction project covering structural work through to finishing, coordinated by ANIKA's project execution team.",
    scope: ["Structural construction", "Manpower coordination", "Material supply"],
    execution:
      "Execution follows standard construction sequencing, with ANIKA coordinating suppliers and on-site teams throughout.",
    image: "/images/project-building.jpg",
  },
  {
    slug: "engineering-operations",
    name: "Engineering Operations",
    category: "Construction",
    location: "Bangladesh",
    year: "[Year to be confirmed]",
    status: "Ongoing",
    summary: "On-site engineering and operations management supporting active project delivery.",
    overview:
      "Engineering and operations management work supporting the day-to-day running of an active project site.",
    scope: ["On-site engineering support", "Operations management", "Quality oversight"],
    execution:
      "A dedicated operations presence on site ensures engineering decisions and day-to-day execution stay aligned.",
    image: "/images/project-engineering.jpg",
  },
  {
    slug: "materials-to-site",
    name: "Materials to Site",
    category: "Supply",
    location: "Bangladesh",
    year: "[Year to be confirmed]",
    status: "Ongoing",
    summary: "Materials sourcing and logistics, moving supply from origin to active project sites.",
    overview:
      "A supply and logistics project moving construction materials from source to active project sites on schedule.",
    scope: ["Materials sourcing", "Logistics & transport", "Site delivery scheduling"],
    execution:
      "Deliveries are scheduled against site demand, with sourcing and transport coordinated to avoid delays.",
    image: "/images/project-logistics.jpg",
  },
  {
    slug: "industrial-capability",
    name: "Industrial Capability",
    category: "Supply",
    location: "Bangladesh",
    year: "[Year to be confirmed]",
    status: "Ongoing",
    summary: "Industrial-scale supply and coordination capability supporting institutional requirements.",
    overview:
      "Industrial-scale supply coordination supporting institutional and large-volume requirements.",
    scope: ["Industrial supply coordination", "Institutional requirements", "Volume scheduling"],
    execution:
      "Supply volumes are planned and scheduled to match institutional requirements as they're confirmed.",
    image: "/images/project-industrial.jpg",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getRelatedProjects(slug: string, count = 2) {
  const current = getProjectBySlug(slug);
  if (!current) return [];
  return projects.filter((p) => p.slug !== slug && p.category === current.category).slice(0, count).length > 0
    ? projects.filter((p) => p.slug !== slug && p.category === current.category).slice(0, count)
    : projects.filter((p) => p.slug !== slug).slice(0, count);
}
