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

type Status = "idle" | "loading" | "success" | "error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ContactFormProps = {
  inquirySectors?: string[];
  successMessage?: string;
};

export default function ContactForm({
  inquirySectors: helpOptions = defaultHelpOptions,
  successMessage = defaultSuccessMessage,
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          phone: data.get("phone"),
          sector: data.get("sector") || "General",
          message: data.get("message"),
        }),
      });

      if (!res.ok) throw new Error("Inquiry submission failed");
      form.reset();
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
        <h3 className="mt-6 font-display text-xl font-medium text-navy-deeper">
          Message Sent
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink/55">
          {successMessage}
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-navy hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
      <label className="block text-[13px] font-semibold text-ink/70">
        What can we help you with?
        <select
          name="sector"
          required
          defaultValue=""
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
        <Field label="Country" name="country" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
        <Field label="Subject" name="subject" />
      </div>

      <label className="mt-5 block text-[13px] font-semibold text-ink/70">
        Message
        <textarea
          name="message"
          required
          rows={5}
          className="mt-2 w-full resize-none rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
          placeholder="Tell us about your requirement..."
        />
      </label>

      <label className="mt-5 block text-[13px] font-semibold text-ink/70">
        Attachment (optional)
        <input
          type="file"
          className="mt-2 w-full rounded-lg border border-dashed border-black/20 bg-mist/50 px-4 py-3 text-xs text-ink/50 file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
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
        disabled={status === "loading"}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {status === "loading" ? "SENDING..." : "SEND INQUIRY"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-[13px] font-semibold text-ink/70">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
      />
    </label>
  );
}
