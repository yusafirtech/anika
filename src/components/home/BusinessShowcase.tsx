import BusinessShowcaseDesktop from "./BusinessShowcaseDesktop";
import BusinessShowcaseMobile from "./BusinessShowcaseMobile";
import type { BusinessShowcaseItem } from "@/data/home";
import type { Dictionary } from "@/i18n/dictionaries";

export default function BusinessShowcase({
  businessShowcase,
  dict,
}: {
  businessShowcase?: BusinessShowcaseItem[];
  dict?: Dictionary["home"];
}) {
  return (
    <>
      <div className="md:hidden">
        <BusinessShowcaseMobile businessShowcase={businessShowcase} dict={dict} />
      </div>
      <div className="hidden md:block">
        <BusinessShowcaseDesktop businessShowcase={businessShowcase} dict={dict} />
      </div>
    </>
  );
}
