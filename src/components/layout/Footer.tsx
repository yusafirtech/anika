import Link from "next/link";
import Image from "next/image";
import { footerColumns as defaultFooterColumns, companyInfo as defaultCompanyInfo } from "@/data/site";

type FooterColumn = { title: string; links: { label: string; href: string }[] };
type CompanyInfo = { name: string; address: string; phone: string; email: string };

export default function Footer({
  footerColumns = defaultFooterColumns,
  companyInfo = defaultCompanyInfo,
}: {
  footerColumns?: FooterColumn[];
  companyInfo?: CompanyInfo;
}) {
  const contactColumn: FooterColumn = {
    title: "Contact",
    links: [
      { label: companyInfo.address, href: "/contact" },
      { label: companyInfo.phone, href: "/contact" },
      { label: companyInfo.email, href: "/contact" },
    ],
  };

  return (
    <footer className="bg-navy-deeper text-white/70">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/anika-official-logo.png"
                alt="ANIKA Trading & Co."
                width={30}
                height={36}
                className="h-8 w-auto"
              />
              <span className="font-display text-[13px] font-semibold tracking-[0.15em] text-white">
                ANIKA TRADING&nbsp;&amp;&nbsp;CO.
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              A Bangladesh-based diversified business company across construction,
              government supply, distribution, trading and international export.
            </p>
            <div className="brand-gradient-line mt-6 w-16" />
          </div>

          {[...footerColumns, contactColumn].map((col) => (
            <div key={col.title}>
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.15em] text-white/40">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm leading-snug text-white/60 transition-colors hover:text-teal-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {companyInfo.name} All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white/70">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/70">
              Terms &amp; Conditions
            </Link>
            <Link href="/cookie-policy" className="hover:text-white/70">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
