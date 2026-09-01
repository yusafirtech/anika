import WhyAnikaDesktop from "./WhyAnikaDesktop";
import WhyAnikaMobile from "./WhyAnikaMobile";

export default function WhyAnika() {
  return (
    <>
      <div className="md:hidden">
        <WhyAnikaMobile />
      </div>
      <div className="hidden md:block">
        <WhyAnikaDesktop />
      </div>
    </>
  );
}
