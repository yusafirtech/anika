"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function useClientLocale() {
  if (typeof document === "undefined") return "en" as const;
  const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
  const value = match?.[1];
  return value === "ar" || value === "bn" ? value : "en";
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const dict = getDictionary(useClientLocale()).account;
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      // This effect synchronizes with the verification API based on the
      // URL's token param (an external input) — the sanctioned use case for
      // setState-in-effect. The missing-token branch is just the same sync,
      // short-circuited.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      return;
    }
    fetch(`${API_URL}/buyer-auth/verify?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Verification failed");
        setStatus("success");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, [searchParams]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-paper px-6 py-28">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center">
        {status === "verifying" && <p className="text-sm text-ink/60">{dict.verifyingHeading}</p>}
        {status === "success" && (
          <>
            <h1 className="font-display text-xl font-medium text-navy-deeper">{dict.verifySuccess}</h1>
            <Link
              href="/account/dashboard"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-navy-deeper"
            >
              {dict.goToDashboard}
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-sm text-red-600">{error || dict.verifyError}</p>
            <Link href="/account/login" className="mt-6 block text-sm font-semibold text-navy hover:underline">
              {dict.backToLogin}
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
