import HomeHero from "@/components/home/HomeHero";
import SectorStory from "@/components/home/SectorStory";
import BusinessShowcase from "@/components/home/BusinessShowcase";
import ProjectStory from "@/components/home/ProjectStory";
import WhyAnika from "@/components/home/WhyAnika";
import HomeCTA from "@/components/home/HomeCTA";
import ScrollProgress from "@/components/home/ScrollProgress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <HomeHero />
      <SectorStory />
      <BusinessShowcase />
      <ProjectStory />
      <WhyAnika />
      <HomeCTA />
    </>
  );
}
