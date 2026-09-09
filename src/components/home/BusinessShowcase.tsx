import BusinessShowcaseDesktop from "./BusinessShowcaseDesktop";
import BusinessShowcaseMobile from "./BusinessShowcaseMobile";
import type { BusinessShowcaseItem } from "@/data/home";

export default function BusinessShowcase({
  businessShowcase,
}: {
  businessShowcase?: BusinessShowcaseItem[];
}) {
  return (
    <>
      <div className="md:hidden">
        <BusinessShowcaseMobile businessShowcase={businessShowcase} />
      </div>
      <div className="hidden md:block">
        <BusinessShowcaseDesktop businessShowcase={businessShowcase} />
      </div>
    </>
  );
}
