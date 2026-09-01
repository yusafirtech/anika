import SectorStoryDesktop from "./SectorStoryDesktop";
import SectorStoryMobile from "./SectorStoryMobile";

/**
 * Renders a genuinely different (not just shrunk) layout on mobile vs desktop.
 * Both are server-rendered so there's no hydration flash; visibility is
 * controlled with a CSS media query wrapper via Tailwind's responsive
 * `hidden` utilities so only the relevant one paints/animates.
 */
export default function SectorStory() {
  return (
    <>
      <div className="md:hidden">
        <SectorStoryMobile />
      </div>
      <div className="hidden md:block">
        <SectorStoryDesktop />
      </div>
    </>
  );
}
