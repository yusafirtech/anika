import HomeHero from "@/components/home/HomeHero";
import HomeFeaturedExports from "@/components/home/HomeFeaturedExports";
import SectorStory from "@/components/home/SectorStory";
import BusinessShowcase from "@/components/home/BusinessShowcase";
import ProjectStory from "@/components/home/ProjectStory";
import WhyAnika from "@/components/home/WhyAnika";
import HomeCTA from "@/components/home/HomeCTA";
import HomeInsights from "@/components/home/HomeInsights";
import { getInsights, getPageContent, getExportContent } from "@/lib/cms";
import type { HomePageContent } from "@/types/cms";
import { sectorStories, businessShowcase, whyReasons } from "@/data/home";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

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
  const [content, insights, exportContent, locale] = await Promise.all([
    getPageContent<HomePageContent>("home", DEFAULT_HOME_CONTENT),
    getInsights({ limit: 4 }),
    getExportContent(),
    getLocale(),
  ]);
  const fullDict = getDictionary(locale);
  const dict = fullDict.home;

  return (
    <>
      <HomeHero {...content.hero} scrollLabel={dict.scroll} />
      <HomeFeaturedExports products={exportContent.products} dict={dict} productDict={fullDict.product} />
      <SectorStory sectorStories={content.sectorStories} dict={dict} />
      <BusinessShowcase businessShowcase={content.businessShowcase} dict={dict} />
      <ProjectStory dict={dict} />
      <WhyAnika whyReasons={content.whyReasons} dict={dict} />
      <HomeInsights insights={insights} dict={dict} readLabel={fullDict.insightsExtra.readInsight} />
      <HomeCTA {...content.cta} />
    </>
  );
}
