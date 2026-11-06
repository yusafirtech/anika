"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function useClientLocale() {
  if (typeof document === "undefined") return "en" as const;
  const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
  const value = match?.[1];
  return value === "ar" || value === "bn" ? value : "en";
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dict = getDictionary(useClientLocale()).account;
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const password = String(new FormData(e.currentTarget).get("password") || "");
    try {
      const res = await fetch(`${API_URL}/buyer-auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Reset failed");
      router.push("/account/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
      setStatus("error");
    }
  }

  if (!token) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-paper px-6 py-28">
        <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center">
          <p className="text-sm text-red-600">{dict.verifyError}</p>
          <Link href="/account/forgot-password" className="mt-6 block text-sm font-semibold text-navy hover:underline">
            {dict.forgotHeading}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-paper px-6 py-28">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8">
        <h1 className="font-display text-2xl font-medium text-navy-deeper">{dict.resetHeading}</h1>
        <p className="mt-2 text-sm text-ink/60">{dict.resetSubheading}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-[13px] font-semibold text-ink/70">
            {dict.newPassword}
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 flex w-full items-center justify-center rounded-full bg-navy px-6 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-navy-deeper disabled:opacity-60"
          >
            {status === "loading" ? dict.resetting : dict.resetPassword}
          </button>
        </form>

        <Link href="/account/login" className="mt-5 block text-center text-sm font-semibold text-navy hover:underline">
          {dict.backToLogin}
        </Link>
      </div>
    </section>
  );
}
