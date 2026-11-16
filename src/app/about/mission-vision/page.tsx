import type { Metadata } from "next";
import Link from "next/link";
import MissionVision from "@/components/about/MissionVision";
import { getPageContent } from "@/lib/cms";
import type { AboutPageContent } from "@/types/cms";
import { DEFAULT_ABOUT_CONTENT } from "@/data/about";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export const metadata: Metadata = {
  title: "Mission & Vision",
  description:
    "ANIKA TRADING & CO.'s mission and vision — what drives the company across construction, supply, distribution and international export.",
  alternates: { canonical: "/about/mission-vision" },
};

export default async function MissionVisionPage() {
  const [content, locale] = await Promise.all([
    getPageContent<AboutPageContent>("about", DEFAULT_ABOUT_CONTENT),
    getLocale(),
  ]);
  const dict = getDictionary(locale).aboutExtra;

  return (
    <>
      <MissionVision {...content.missionVision} />
      <section className="bg-paper py-10">
        <div className="mx-auto max-w-6xl px-6 text-center md:px-8">
          <Link href="/about" className="text-sm font-semibold text-navy hover:underline">
            &larr; {dict.backToAbout}
          </Link>
        </div>
      </section>
    </>
  );
}
