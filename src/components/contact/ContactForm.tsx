"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const defaultSuccessMessage = "Thanks for reaching out. The ANIKA team will get back to you shortly.";
const PRODUCT_INQUIRY = "Product Inquiry";

type Status = "idle" | "loading" | "success" | "error";
type BuyerType = "international" | "bangladesh";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ContactFormProps = {
  inquirySectors?: string[];
  successMessage?: string;
  product?: { name: string; slug: string } | null;
};

export default function ContactForm({
  inquirySectors = defaultHelpOptions,
  successMessage = defaultSuccessMessage,
  product = null,
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [submittedAs, setSubmittedAs] = useState<BuyerType>("international");

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
        headers: { "Content-Type": "application/json" },
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
        <h3 className="mt-6 font-display text-xl font-medium text-navy-deeper">Message Sent</h3>
        {submittedAs === "bangladesh" && (
          <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#006a4e]/10 px-3 py-1 text-xs font-semibold text-[#006a4e]">
            <FlagMark /> Bangladeshi bulk buyer request
          </span>
        )}
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/55">{successMessage}</p>
        <button onClick={() => setStatus("idle")} className="mt-6 text-sm font-semibold text-navy hover:underline">
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
      {product && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-navy/10 bg-navy/[0.04] px-4 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-navy/60">Quote for</span>
          <span className="truncate text-sm font-semibold text-navy-deeper">{product.name}</span>
        </div>
      )}

      <label className="block text-[13px] font-semibold text-ink/70">
        What can we help you with?
        <select
          name="sector"
          required
          defaultValue={product ? PRODUCT_INQUIRY : ""}
          className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
        >
          <option value="" disabled>
            Select an inquiry type
          </option>
          {helpOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Name" name="name" required />
        <Field label="Company" name="company" />
        <Field label="Country" name="country" />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone / WhatsApp" name="phone" type="tel" />
        <Field label="Subject" name="subject" defaultValue={product ? `Quote request: ${product.name}` : undefined} />
      </div>

      <label className="mt-5 block text-[13px] font-semibold text-ink/70">
        Message
        <textarea
          name="message"
          required
          rows={5}
          defaultValue={
            product
              ? `I'd like a quote for ${product.name}.\n\nQuantity:\nDestination / delivery location:\nPreferred packaging:`
              : undefined
          }
          className="mt-2 w-full resize-none rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
          placeholder="Tell us about your requirement — product, quantity, destination..."
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
            Something went wrong. Please try again.
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
        {status === "loading" ? "SENDING..." : "SEND INQUIRY"}
      </button>

      <div className="my-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/35">
        <span className="h-px flex-1 bg-black/10" />
        or
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
        SUBMIT AS A BANGLADESHI BULK BUYER
      </button>
      <p className="mt-2.5 text-center text-xs leading-relaxed text-ink/50">
        Buying in bulk within Bangladesh? Use this button and our local sales team will handle your request.
      </p>
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block text-[13px] font-semibold text-ink/70">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
      />
    </label>
  );
}
