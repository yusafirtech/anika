"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBuyerAuth } from "@/context/BuyerAuthContext";
import { getDictionary } from "@/i18n/dictionaries";

function useClientLocale() {
  if (typeof document === "undefined") return "en" as const;
  const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
  const value = match?.[1];
  return value === "ar" || value === "bn" ? value : "en";
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useBuyerAuth();
  const dict = getDictionary(useClientLocale()).account;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const result = await login(String(data.get("email") || ""), String(data.get("password") || ""));
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
        <h1 className="font-display text-2xl font-medium text-navy-deeper">{dict.loginHeading}</h1>
        <p className="mt-2 text-sm text-ink/60">{dict.loginSubheading}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-[13px] font-semibold text-ink/70">
            {dict.email}
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
            />
          </label>
          <label className="block text-[13px] font-semibold text-ink/70">
            {dict.password}
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-navy/50"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Link href="/account/forgot-password" className="block text-right text-xs font-semibold text-navy/70 hover:text-navy hover:underline">
            {dict.forgotPassword}
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-full bg-navy px-6 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-navy-deeper disabled:opacity-60"
          >
            {loading ? dict.signingIn : dict.signIn}
          </button>
        </form>

        <Link href="/account/register" className="mt-5 block text-center text-sm font-semibold text-navy hover:underline">
          {dict.needAccount}
        </Link>
      </div>
    </section>
  );
}
