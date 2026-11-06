import SectorStoryDesktop from "./SectorStoryDesktop";
import SectorStoryMobile from "./SectorStoryMobile";
import type { SectorStory as SectorStoryType } from "@/data/home";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Renders a genuinely different (not just shrunk) layout on mobile vs desktop.
 * Both are server-rendered so there's no hydration flash; visibility is
 * controlled with a CSS media query wrapper via Tailwind's responsive
 * `hidden` utilities so only the relevant one paints/animates.
 */
export default function SectorStory({
  sectorStories,
  dict,
}: {
  sectorStories?: SectorStoryType[];
  dict?: Dictionary["home"];
}) {
  return (
    <>
      <div className="md:hidden">
        <SectorStoryMobile sectorStories={sectorStories} dict={dict} />
      </div>
      <div className="hidden md:block">
        <SectorStoryDesktop sectorStories={sectorStories} dict={dict} />
      </div>
    </>
  );
}
