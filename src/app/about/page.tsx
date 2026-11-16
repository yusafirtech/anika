import type { Metadata } from "next";
import Link from "next/link";
import AboutIntro from "@/components/about/AboutIntro";
import CompanyTimeline from "@/components/about/CompanyTimeline";
import AboutGallery from "@/components/about/AboutGallery";
import AboutTeamPreview from "@/components/about/AboutTeamPreview";
import CoreValues from "@/components/about/CoreValues";
import ExportCredentials from "@/components/about/ExportCredentials";
import BusinessPhilosophy from "@/components/about/BusinessPhilosophy";
import { getPageContent } from "@/lib/cms";
import type { AboutPageContent, SiteGlobalContent, TeamPageContent } from "@/types/cms";
import { DEFAULT_ABOUT_CONTENT } from "@/data/about";
import { teamMembers } from "@/data/team";
import { companyInfo, navLinks, footerColumns } from "@/data/site";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ANIKA TRADING & CO. is a Bangladesh-based diversified business company across construction, government supply, distribution, trading and export.",
};

const DEFAULT_TEAM_CONTENT: TeamPageContent = {
  intro: { eyebrow: "", heading: "", description: "" },
  members: teamMembers,
  departments: [],
};

export default async function AboutPage() {
  const [content, team, site, locale] = await Promise.all([
    getPageContent<AboutPageContent>("about", DEFAULT_ABOUT_CONTENT),
    getPageContent<TeamPageContent>("team", DEFAULT_TEAM_CONTENT),
    getPageContent<SiteGlobalContent>("site", { companyInfo, navLinks, footerColumns }),
    getLocale(),
  ]);
  const dict = getDictionary(locale).aboutExtra;

  return (
    <>
      <AboutIntro {...content.intro} />
      <CompanyTimeline timeline={content.timeline} />
      <AboutGallery {...content.gallery} />
      <AboutTeamPreview members={team.members} dict={dict} />

      <section className="bg-navy-deeper py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
            {dict.missionVisionEyebrow}
          </p>
          <Link
            href="/about/mission-vision"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold tracking-wide text-navy-deeper transition-transform hover:scale-[1.03]"
          >
            {dict.missionVisionCta} <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </section>

      <CoreValues coreValues={content.coreValues} dict={dict} />
      <ExportCredentials credentials={site.credentials} />
      <BusinessPhilosophy image={content.philosophy.image} images={content.philosophy.images} dict={dict} />
    </>
  );
}
