"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useBuyerAuth } from "@/context/BuyerAuthContext";
import type { Dictionary } from "@/i18n/dictionaries";
import en from "@/i18n/dictionaries/en";

const defaultHelpOptions = [
  "Construction Project",
  "Government Supply",
  "Private Supply",
  "Distribution",
  "Import",
  "Export",
  "Product Inquiry",
  "Partnership",
  "General Inquiry",
];

const PRODUCT_INQUIRY = "Product Inquiry";

type Status = "idle" | "loading" | "success" | "error";
type BuyerType = "international" | "bangladesh";
type RequestType = "quote" | "sample";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ContactFormProps = {
  inquirySectors?: string[];
  successMessage?: string;
  product?: { name: string; slug: string } | null;
  requestType?: RequestType;
  dict?: Dictionary["contactForm"];
};

export default function ContactForm({
  inquirySectors = defaultHelpOptions,
  successMessage,
  product = null,
  requestType,
  dict = en.contactForm,
}: ContactFormProps) {
  const searchParams = useSearchParams();
  const { buyer, token } = useBuyerAuth();
  const [status, setStatus] = useState<Status>("idle");
  const [submittedAs, setSubmittedAs] = useState<BuyerType>("international");
  const isRfq = Boolean(product && requestType);
  const resolvedSuccessMessage = successMessage || dict.defaultSuccessMessage;
  const prefillSubject = searchParams.get("subject") || undefined;
  const prefillMessage = searchParams.get("message") || undefined;

  const helpOptions =
    product && !inquirySectors.includes(PRODUCT_INQUIRY) ? [PRODUCT_INQUIRY, ...inquirySectors] : inquirySectors;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter;
    const buyerType: BuyerType = submitter?.getAttribute("value") === "bangladesh" ? "bangladesh" : "international";

    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);
    const country = String(data.get("country") || "").trim();

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          phone: data.get("phone"),
          country: country || (buyerType === "bangladesh" ? "Bangladesh" : ""),
          subject: data.get("subject"),
          sector: data.get("sector") || "General",
          message: data.get("message"),
          buyerType,
          requestType: isRfq ? requestType : "general",
          productSlug: product?.slug,
          quantity: isRfq ? data.get("quantity") : undefined,
          quantityUnit: isRfq ? data.get("quantityUnit") : undefined,
          incoterm: isRfq ? data.get("incoterm") : undefined,
          destinationPort: isRfq ? data.get("destinationPort") : undefined,
          targetShipDate: isRfq ? data.get("targetShipDate") : undefined,
          paymentTerms: isRfq ? data.get("paymentTerms") : undefined,
        }),
      });

      if (!res.ok) throw new Error("Inquiry submission failed");
      form.reset();
      setSubmittedAs(buyerType);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-black/10 bg-mist px-8 text-center"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full brand-gradient-bg text-2xl text-white">
          &#10003;
        </span>
        <h3 className="mt-6 font-display text-xl font-medium text-navy-deeper">{dict.messageSent}</h3>
        {submittedAs === "bangladesh" && (
          <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#006a4e]/10 px-3 py-1 text-xs font-semibold text-[#006a4e]">
            <FlagMark /> {dict.bangladeshBadge}
          </span>
        )}
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/55">{resolvedSuccessMessage}</p>
        <button onClick={() => setStatus("idle")} className="mt-6 text-sm font-semibold text-navy hover:underline">
          {dict.sendAnother}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
      {product && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-navy/10 bg-navy/[0.04] px-4 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-navy/60">
            {requestType === "sample" ? dict.sampleFor : dict.quoteFor}
          </span>
          <span className="truncate text-sm font-semibold text-navy-deeper">{product.name}</span>
        </div>
      )}

      <label className="block text-[13px] font-semibold text-ink/70">
        {dict.helpLabel}
        <select
          name="sector"
          required
          defaultValue={product ? PRODUCT_INQUIRY : ""}
          className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
        >
          <option value="" disabled>
            {dict.selectPlaceholder}
          </option>
          {helpOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label={dict.fullName} name="name" required defaultValue={buyer?.name} />
        <Field label={dict.company} name="company" defaultValue={buyer?.company} />
        <Field label={dict.country} name="country" defaultValue={buyer?.country} />
        <Field label={dict.email} name="email" type="email" required defaultValue={buyer?.email} />
        <Field label={dict.phone} name="phone" type="tel" />
        <Field
          label={dict.subject}
          name="subject"
          defaultValue={
            prefillSubject ||
            (product
              ? `${requestType === "sample" ? dict.sampleFor : dict.quoteFor}: ${product.name}`
              : undefined)
          }
        />
      </div>

      {isRfq && (
        <div className="mt-6 rounded-xl border border-black/10 bg-mist/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-navy/60">{dict.rfqHeading}</p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex gap-2 sm:col-span-2">
              <div className="w-28 shrink-0">
                <Field label={dict.quantity} name="quantity" placeholder="e.g. 20" />
              </div>
              <label className="block flex-1 text-[13px] font-semibold text-ink/70">
                {dict.unit}
                <select
                  name="quantityUnit"
                  defaultValue=""
                  className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
                >
                  <option value="">{dict.selectUnit}</option>
                  {dict.quantityUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block text-[13px] font-semibold text-ink/70">
              {dict.incoterm}
              <select
                name="incoterm"
                defaultValue=""
                className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
              >
                <option value="">{dict.selectIncoterm}</option>
                {dict.incoterms.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-[13px] font-semibold text-ink/70">
              {dict.paymentTerms}
              <select
                name="paymentTerms"
                defaultValue=""
                className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
              >
                <option value="">{dict.selectPaymentTerms}</option>
                {dict.paymentTermsOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <Field label={dict.destinationPort} name="destinationPort" placeholder="e.g. Jebel Ali, Dubai" />
            <Field label={dict.targetShipDate} name="targetShipDate" type="date" />
          </div>
        </div>
      )}

      <label className="mt-5 block text-[13px] font-semibold text-ink/70">
        {dict.message}
        <textarea
          name="message"
          required={!isRfq}
          rows={isRfq ? 3 : 5}
          defaultValue={
            prefillMessage ||
            (product && !isRfq
              ? `I'd like a quote for ${product.name}.\n\nQuantity:\nDestination / delivery location:\nPreferred packaging:`
              : undefined)
          }
          className="mt-2 w-full resize-none rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
          placeholder={isRfq ? dict.messagePlaceholderRfq : dict.messagePlaceholderGeneral}
        />
      </label>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-sm text-red-600"
          >
            {dict.errorGeneric}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        name="buyerType"
        value="international"
        disabled={status === "loading"}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-navy-deeper disabled:opacity-60"
      >
        {status === "loading" ? dict.sending : dict.sendInquiry}
      </button>

      <div className="my-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/35">
        <span className="h-px flex-1 bg-black/10" />
        {dict.orDivider}
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <button
        type="submit"
        name="buyerType"
        value="bangladesh"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-[#006a4e] bg-[#006a4e]/[0.04] px-6 py-3 text-[13px] font-semibold tracking-wide text-[#006a4e] transition-colors hover:bg-[#006a4e] hover:text-white disabled:opacity-60"
      >
        <FlagMark />
        {dict.bangladeshCta}
      </button>
      <p className="mt-2.5 text-center text-xs leading-relaxed text-ink/50">{dict.bangladeshHint}</p>
    </form>
  );
}

function FlagMark() {
  return (
    <span aria-hidden className="relative inline-block h-3 w-[18px] shrink-0 overflow-hidden rounded-[2px] bg-[#006a4e]">
      <span className="absolute left-[32%] top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-[#f42a41]" />
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-[13px] font-semibold text-ink/70">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
      />
    </label>
  );
}
