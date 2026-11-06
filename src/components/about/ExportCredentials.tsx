import Reveal from "@/components/ui/Reveal";
import type { SiteCredentials } from "@/types/cms";

export default function ExportCredentials({ credentials }: { credentials?: SiteCredentials }) {
  if (!credentials) return null;

  const facts = [
    { label: "Export Registration Certificate (ERC)", value: credentials.exportLicenseNumber },
    { label: "Trade License", value: credentials.tradeLicenseNumber },
    { label: "BIN", value: credentials.binNumber },
    { label: "Chamber of Commerce Membership", value: credentials.chamberOfCommerceMembership },
    { label: "Bank", value: credentials.bankName },
    { label: "Branch", value: credentials.bankBranch },
    { label: "SWIFT / BIC", value: credentials.swiftCode },
  ].filter((f) => f.value);

  if (facts.length === 0 && !credentials.companyProfileUrl) return null;

  return (
    <section className="bg-mist py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <Reveal>
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-navy/60">
            Export Credentials &amp; Compliance
          </p>
          <h2 className="mt-4 text-center font-display text-[26px] font-medium leading-tight text-navy-deeper md:text-[34px]">
            Registered, Licensed, and Ready to Trade.
          </h2>
        </Reveal>

        {facts.length > 0 && (
          <Reveal delay={0.08}>
            <dl className="mx-auto mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.08] sm:grid-cols-2 lg:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="bg-white px-5 py-4">
                  <dt className="text-[11px] uppercase tracking-[0.15em] text-ink/45">{f.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink/85">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {credentials.companyProfileUrl && (
          <Reveal delay={0.12}>
            <div className="mt-8 flex justify-center">
              <a
                href={credentials.companyProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-navy-deeper"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
                </svg>
                DOWNLOAD COMPANY PROFILE (PDF)
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
