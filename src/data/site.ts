export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Business", href: "/business" },
  { label: "Projects", href: "/projects" },
  { label: "Export", href: "/export" },
  { label: "Contact", href: "/contact" },
];

export const companyInfo = {
  name: "ANIKA TRADING & CO.",
  tagline: "Building. Supplying. Exporting. Connecting.",
  address: "Dhaka & Chittagong, Bangladesh",
  phone: "+880 1711 000000",
  email: "info@anikatrading.com",
  whatsapp: "+61 469 024 249",
};

// Note: Footer.tsx always appends its own "Contact" column (built from
// companyInfo) after these, so a "Contact" column is never listed here.
export const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Mission & Vision", href: "/about#mission" },
      { label: "Business", href: "/business" },
      { label: "Projects", href: "/projects" },
      { label: "Partners", href: "/partners" },
      { label: "Insights & News", href: "/insights" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "Construction & Projects", href: "/business#construction" },
      { label: "Government Supply", href: "/business#government-supply" },
      { label: "Supply & Distribution", href: "/business#private-supply" },
      { label: "Import & Trading", href: "/business#trading" },
    ],
  },
  {
    title: "Export",
    links: [
      { label: "Export Overview", href: "/export" },
      { label: "Product Categories", href: "/export#categories" },
      { label: "Export Products", href: "/export/products" },
      { label: "Send a Requirement", href: "/contact" },
    ],
  },
];
