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
  address: "[Official head office address to be provided]",
  phone: "[Official business phone to be provided]",
  email: "[Official business email to be provided]",
  whatsapp: "+61 469 024 249",
};

export const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Mission & Vision", href: "/about#mission" },
      { label: "Business", href: "/business" },
      { label: "Projects", href: "/projects" },
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
  {
    title: "Contact",
    links: [
      { label: companyInfo.address, href: "/contact" },
      { label: companyInfo.phone, href: "/contact" },
      { label: companyInfo.email, href: "/contact" },
    ],
  },
];
