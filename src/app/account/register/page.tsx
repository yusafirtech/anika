"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBuyerAuth } from "@/context/BuyerAuthContext";
import { getDictionary } from "@/i18n/dictionaries";

// Client Components can't call the server-only getLocale(); the account
// pages read the same NEXT_LOCALE cookie directly on the client instead.
function useClientLocale() {
  if (typeof document === "undefined") return "en" as const;
  const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
  const value = match?.[1];
  return value === "ar" || value === "bn" ? value : "en";
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useBuyerAuth();
  const dict = getDictionary(useClientLocale()).account;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const result = await register({
      name: String(data.get("name") || ""),
      company: String(data.get("company") || ""),
      email: String(data.get("email") || ""),
      password: String(data.get("password") || ""),
      country: String(data.get("country") || ""),
    });
    setLoading(false);
    if (result.ok) {
      router.push("/account/dashboard");
    } else {
      setError(result.error);
    }
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-paper px-6 py-28">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8">
        <h1 className="font-display text-2xl font-medium text-navy-deeper">{dict.registerHeading}</h1>
        <p className="mt-2 text-sm text-ink/60">{dict.registerSubheading}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label={dict.fullName} name="name" required />
          <Field label={dict.company} name="company" />
          <Field label={dict.email} name="email" type="email" required />
          <Field label={dict.password} name="password" type="password" required minLength={8} />
          <Field label={dict.country} name="country" />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-full bg-navy px-6 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-navy-deeper disabled:opacity-60"
          >
            {loading ? dict.creating : dict.createAccount}
          </button>
        </form>

        <Link href="/account/login" className="mt-5 block text-center text-sm font-semibold text-navy hover:underline">
          {dict.alreadyHaveAccount}
        </Link>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  minLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block text-[13px] font-semibold text-ink/70">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
      />
    </label>
  );
}
