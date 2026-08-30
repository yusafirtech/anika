import type { Metadata } from "next";
import TeamHero from "@/components/team/TeamHero";
import TeamGrid from "@/components/team/TeamGrid";
import TeamCTA from "@/components/team/TeamCTA";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the leadership and management team behind ANIKA TRADING & CO. — experienced professionals across construction, government supply, export, finance, and operations.",
};

export default function TeamPage() {
  return (
    <>
      <TeamHero />
      <TeamGrid />
      <TeamCTA />
    </>
  );
}
