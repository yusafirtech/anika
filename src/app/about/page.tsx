import type { Metadata } from "next";
import AboutIntro from "@/components/about/AboutIntro";
import CompanyTimeline from "@/components/about/CompanyTimeline";
import MissionVision from "@/components/about/MissionVision";
import CoreValues from "@/components/about/CoreValues";
import BusinessPhilosophy from "@/components/about/BusinessPhilosophy";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ANIKA TRADING & CO. is a Bangladesh-based diversified business company across construction, government supply, distribution, trading and export.",
};

export default function AboutPage() {
  return (
    <>
      <AboutIntro />
      <CompanyTimeline />
      <MissionVision />
      <CoreValues />
      <BusinessPhilosophy />
    </>
  );
}
