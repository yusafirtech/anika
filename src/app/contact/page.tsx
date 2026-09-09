import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import { companyInfo } from "@/data/site";
import { getPageContent, resolveImageUrl } from "@/lib/cms";
import type { ContactPageContent } from "@/types/cms";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with ANIKA TRADING & CO. about a project, supply requirement, product inquiry or partnership.",
};

const DEFAULT_CONTACT_CONTENT: ContactPageContent = {
  hero: {
    eyebrow: "Get In Touch",
    heading: "Let’s Start a Conversation",
    bgImage: "/images/trade-detail.jpg",
  },
  intro: {
    text: "Whether you’re exploring a construction project, a government or private supply requirement, an import or export inquiry, or a business partnership — reach out and the ANIKA team will get back to you.",
  },
  coordinates: {
    address: companyInfo.address,
    phone: companyInfo.phone,
    email: companyInfo.email,
    whatsapp: companyInfo.whatsapp,
  },
  formSettings: {
    inquirySectors: [
      "Construction Project",
      "Government Supply",
      "Private Supply",
      "Distribution",
      "Import",
      "Export",
      "Product Inquiry",
      "Partnership",
      "General Inquiry",
    ],
    successMessage: "Thanks for reaching out. The ANIKA team will get back to you shortly.",
  },
};

export default async function ContactPage() {
  const content = await getPageContent<ContactPageContent>("contact", DEFAULT_CONTACT_CONTENT);

  const infoBlocks = [
    { label: "Head Office", value: content.coordinates.address },
    { label: "Phone", value: content.coordinates.phone },
    { label: "Email", value: content.coordinates.email },
    { label: "WhatsApp", value: content.coordinates.whatsapp },
  ];

  return (
    <section className="relative bg-paper pt-24 md:pt-28">
      <div className="relative h-[36vh] w-full overflow-hidden md:h-[44vh]">
        <Image
          src={resolveImageUrl(content.hero.bgImage)}
          alt="ANIKA business operations"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-navy-deeper/30 to-navy-deeper/60" />
        <div className="absolute inset-0 flex flex-col items-start justify-end px-6 pb-10 md:px-8 md:pb-14">
          <div className="mx-auto w-full max-w-6xl">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light">
                {content.hero.eyebrow}
              </p>
              <h1 className="mt-4 max-w-lg font-display text-[32px] font-medium leading-tight text-white md:text-[46px]">
                {content.hero.heading}
              </h1>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <div>
            <Reveal>
              <p className="max-w-sm text-[15px] leading-relaxed text-ink/60">
                {content.intro.text}
              </p>
            </Reveal>

            <div className="mt-10 flex flex-col gap-6">
              {infoBlocks.map((block, i) => (
                <Reveal key={block.label} delay={0.06 * i}>
                  <div className="border-b border-black/10 pb-5">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-navy/50">
                      {block.label}
                    </span>
                    <span className="mt-1.5 block text-[15px] text-ink/75">{block.value}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <ContactForm
              inquirySectors={content.formSettings.inquirySectors}
              successMessage={content.formSettings.successMessage}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
