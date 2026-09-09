import WhyAnikaDesktop from "./WhyAnikaDesktop";
import WhyAnikaMobile from "./WhyAnikaMobile";
import type { WhyReason } from "@/data/home";

export default function WhyAnika({ whyReasons }: { whyReasons?: WhyReason[] }) {
  return (
    <>
      <div className="md:hidden">
        <WhyAnikaMobile whyReasons={whyReasons} />
      </div>
      <div className="hidden md:block">
        <WhyAnikaDesktop whyReasons={whyReasons} />
      </div>
    </>
  );
}
