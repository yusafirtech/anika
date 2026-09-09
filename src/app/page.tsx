import HomeHero from "@/components/home/HomeHero";
import SectorStory from "@/components/home/SectorStory";
import BusinessShowcase from "@/components/home/BusinessShowcase";
import ProjectStory from "@/components/home/ProjectStory";
import WhyAnika from "@/components/home/WhyAnika";
import HomeCTA from "@/components/home/HomeCTA";
import ScrollProgress from "@/components/home/ScrollProgress";
import { getPageContent } from "@/lib/cms";
import type { HomePageContent } from "@/types/cms";
import { sectorStories, businessShowcase, whyReasons } from "@/data/home";

const DEFAULT_HOME_CONTENT: HomePageContent = {
  hero: {
    eyebrow: "One Company · Multiple Sectors · One Connected Business",
    headlineWords: ["Building.", "Supplying.", "Exporting.", "Connecting."],
    subtitle:
      "ANIKA TRADING & CO. connects Bangladesh’s capabilities with projects, supply chains and international markets.",
    bgImage: "/images/hero-port-supply-route.jpg",
    ctaText: "START A CONVERSATION",
    ctaLink: "/contact",
    keywords: [
      "EXPORT",
      "SEAFOOD",
      "AGRICULTURE",
      "CONSTRUCTION",
      "GOVERNMENT TENDERS",
      "SUPPLY & TRADING",
    ],
  },
  sectorStories,
  businessShowcase,
  whyReasons,
  cta: {
    eyebrow: "Business Inquiry",
    heading: "Let’s Build the Next Opportunity Together.",
    description:
      "Whether you are looking for products from Bangladesh, exploring a supply requirement, discussing a project or seeking a business partnership, talk to ANIKA.",
    primaryCtaText: "START A CONVERSATION",
    primaryCtaLink: "/contact",
    secondaryCtaText: "EXPLORE EXPORT PRODUCTS",
    secondaryCtaLink: "/export",
    bgImage: "/images/final-cta-port.jpg",
  },
};

export default async function Home() {
  const content = await getPageContent<HomePageContent>("home", DEFAULT_HOME_CONTENT);

  return (
    <>
      <ScrollProgress />
      <HomeHero {...content.hero} />
      <SectorStory sectorStories={content.sectorStories} />
      <BusinessShowcase businessShowcase={content.businessShowcase} />
      <ProjectStory />
      <WhyAnika whyReasons={content.whyReasons} />
      <HomeCTA {...content.cta} />
    </>
  );
}
