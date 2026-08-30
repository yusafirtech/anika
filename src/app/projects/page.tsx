import type { Metadata } from "next";
import PageIntro from "@/components/ui/PageIntro";
import ProjectsGrid from "@/components/projects/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A record of ANIKA's work, execution and business capability across construction and supply.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Our Projects"
        title="A Record of Execution."
        description="A record of work, execution and business capability across construction, supply and related activities."
      />
      <ProjectsGrid />
    </>
  );
}
