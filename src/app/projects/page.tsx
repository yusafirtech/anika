import type { Metadata } from "next";
import PageIntro from "@/components/ui/PageIntro";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import { getPageContent } from "@/lib/cms";
import type { ProjectsPageContent } from "@/types/cms";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A record of ANIKA's work, execution and business capability across construction and supply.",
};

const DEFAULT_PROJECTS_CONTENT: ProjectsPageContent = {
  intro: {
    eyebrow: "Our Projects",
    heading: "A Record of Execution.",
    description:
      "A record of work, execution and business capability across construction, supply and related activities.",
  },
  projects,
};

export default async function ProjectsPage() {
  const content = await getPageContent<ProjectsPageContent>("projects", DEFAULT_PROJECTS_CONTENT);

  return (
    <>
      <PageIntro
        eyebrow={content.intro.eyebrow}
        title={content.intro.heading}
        description={content.intro.description}
      />
      <ProjectsGrid projects={content.projects} />
    </>
  );
}
