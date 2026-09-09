import type { Metadata } from "next";
import AboutIntro from "@/components/about/AboutIntro";
import CompanyTimeline from "@/components/about/CompanyTimeline";
import MissionVision from "@/components/about/MissionVision";
import CoreValues from "@/components/about/CoreValues";
import BusinessPhilosophy from "@/components/about/BusinessPhilosophy";
import { getPageContent } from "@/lib/cms";
import type { AboutPageContent } from "@/types/cms";
import { timelineStages, coreValues } from "@/data/about";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ANIKA TRADING & CO. is a Bangladesh-based diversified business company across construction, government supply, distribution, trading and export.",
};

const DEFAULT_ABOUT_CONTENT: AboutPageContent = {
  intro: {
    eyebrow: "About ANIKA",
    heading: "A Diversified Business Company Built Around Opportunity.",
    leadText:
      "ANIKA TRADING & CO. is a Bangladesh-based diversified business company involved in construction, government projects, government and private supply, distribution, import and trading, and international export. Rather than specializing in a single sector, ANIKA is built to move across several connected ones.",
    bodyText: "",
    image: "/images/story-agriculture-origin.jpg",
    stats: [],
  },
  timeline: timelineStages,
  missionVision: {
    missionTitle: "Our Mission",
    missionText:
      "To deliver reliable construction, supply, distribution and trading solutions while building long-term relationships with clients, partners and international buyers.",
    visionTitle: "Our Vision",
    visionText:
      "To grow as a trusted and internationally connected Bangladesh-based business company, creating sustainable opportunities across construction, supply, distribution and global trade.",
    pillars: [],
  },
  coreValues,
  philosophy: {
    quote: "",
    narrative: "",
    authorName: "",
    authorTitle: "",
    image: "/images/trade-detail.jpg",
  },
};

export default async function AboutPage() {
  const content = await getPageContent<AboutPageContent>("about", DEFAULT_ABOUT_CONTENT);

  return (
    <>
      <AboutIntro {...content.intro} />
      <CompanyTimeline timeline={content.timeline} />
      <MissionVision {...content.missionVision} />
      <CoreValues coreValues={content.coreValues} />
      <BusinessPhilosophy image={content.philosophy.image} />
    </>
  );
}
