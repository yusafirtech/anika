import WhyAnikaDesktop from "./WhyAnikaDesktop";
import WhyAnikaMobile from "./WhyAnikaMobile";
import type { WhyReason } from "@/data/home";
import type { Dictionary } from "@/i18n/dictionaries";

export default function WhyAnika({
  whyReasons,
  dict,
}: {
  whyReasons?: WhyReason[];
  dict?: Dictionary["home"];
}) {
  return (
    <>
      <div className="md:hidden">
        <WhyAnikaMobile whyReasons={whyReasons} dict={dict} />
      </div>
      <div className="hidden md:block">
        <WhyAnikaDesktop whyReasons={whyReasons} dict={dict} />
      </div>
    </>
  );
}
