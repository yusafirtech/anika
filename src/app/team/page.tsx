import type { Metadata } from "next";
import TeamHero from "@/components/team/TeamHero";
import TeamGrid from "@/components/team/TeamGrid";
import TeamCTA from "@/components/team/TeamCTA";
import { getPageContent } from "@/lib/cms";
import type { TeamPageContent } from "@/types/cms";
import { teamMembers, departments } from "@/data/team";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the leadership and management team behind ANIKA TRADING & CO. — experienced professionals across construction, government supply, export, finance, and operations.",
};

const DEFAULT_TEAM_CONTENT: TeamPageContent = {
  intro: {
    eyebrow: "Our People",
    heading: "The Team Behind ANIKA",
    description:
      "ANIKA TRADING & CO. is built on people who understand their sectors deeply. Each team member brings domain-specific expertise — from construction and government procurement to international trade and finance — contributing to a company that operates with precision across multiple industries.",
  },
  members: teamMembers,
  departments,
};

export default async function TeamPage() {
  const content = await getPageContent<TeamPageContent>("team", DEFAULT_TEAM_CONTENT);

  return (
    <>
      <TeamHero {...content.intro} />
      <TeamGrid members={content.members} departments={content.departments} />
      <TeamCTA />
    </>
  );
}
