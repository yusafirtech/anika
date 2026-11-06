"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import en from "@/i18n/dictionaries/en";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "loading" | "success" | "error" | "invalid";

export default function NewsletterForm({ dict = en.newsletter }: { dict?: Dictionary["newsletter"] }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") || "").trim();

    if (!EMAIL_RE.test(email)) {
      setStatus("invalid");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (!res.ok) throw new Error("Subscribe failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="text-sm text-teal-light">{dict.success}</p>;
  }

  return (
    <div>
      <p className="text-sm font-semibold text-white">{dict.heading}</p>
      <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-white/50">{dict.description}</p>
      <form onSubmit={handleSubmit} className="mt-3 flex max-w-xs items-stretch gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder={dict.placeholder}
          onChange={() => status !== "idle" && setStatus("idle")}
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none placeholder:text-white/35 focus:border-teal-light"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg bg-teal px-3.5 py-2 text-xs font-semibold text-navy-deeper transition-colors hover:bg-teal-light disabled:opacity-60"
        >
          {status === "loading" ? dict.subscribing : dict.subscribe}
        </button>
      </form>
      {(status === "error" || status === "invalid") && (
        <p className="mt-1.5 text-xs text-rose-300">{status === "invalid" ? dict.invalidEmail : dict.error}</p>
      )}
    </div>
  );
}
