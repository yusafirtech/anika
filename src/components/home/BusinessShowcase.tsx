import BusinessShowcaseDesktop from "./BusinessShowcaseDesktop";
import BusinessShowcaseMobile from "./BusinessShowcaseMobile";

export default function BusinessShowcase() {
  return (
    <>
      <div className="md:hidden">
        <BusinessShowcaseMobile />
      </div>
      <div className="hidden md:block">
        <BusinessShowcaseDesktop />
      </div>
    </>
  );
}
