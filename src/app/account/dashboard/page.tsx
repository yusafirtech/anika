"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBuyerAuth } from "@/context/BuyerAuthContext";
import { getDictionary } from "@/i18n/dictionaries";
import type { BuyerLead, BuyerQuotation } from "@/types/buyer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function useClientLocale() {
  if (typeof document === "undefined") return "en" as const;
  const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
  const value = match?.[1];
  return value === "ar" || value === "bn" ? value : "en";
}

function quotationTotal(q: BuyerQuotation) {
  return q.lineItems.reduce((sum, i) => sum + (parseFloat(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0);
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  sent: "bg-sky-50 text-sky-700",
  accepted: "bg-emerald-50 text-emerald-700",
  expired: "bg-rose-50 text-rose-700",
  Pending: "bg-amber-50 text-amber-700",
  Reviewing: "bg-sky-50 text-sky-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-rose-50 text-rose-700",
};

export default function DashboardPage() {
  const router = useRouter();
  const { buyer, token, isLoading, logout, resendVerification } = useBuyerAuth();
  const dict = getDictionary(useClientLocale()).account;
  const [leads, setLeads] = useState<BuyerLead[]>([]);
  const [quotations, setQuotations] = useState<BuyerQuotation[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/account/login");
    }
  }, [isLoading, token, router]);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_URL}/buyer/leads`, { headers }).then((r) => (r.ok ? r.json() : { leads: [] })),
      fetch(`${API_URL}/buyer/quotations`, { headers }).then((r) => (r.ok ? r.json() : { quotations: [] })),
    ]).then(([leadsRes, quotesRes]) => {
      setLeads(leadsRes.leads || []);
      setQuotations(quotesRes.quotations || []);
      setDataLoading(false);
    });
  }, [token]);

  const handleDownload = async (q: BuyerQuotation) => {
    if (!token) return;
    setDownloadingId(q.id);
    try {
      const res = await fetch(`${API_URL}/buyer/quotations/${q.id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${q.quoteNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingId(null);
    }
  };

  const requestAgainHref = (q: BuyerQuotation) => {
    const summary = q.lineItems.map((i) => `${i.description} — ${i.quantity} ${i.unit}`).join("; ");
    const params = new URLSearchParams({
      subject: `Reorder: ${q.quoteNumber}`,
      message: `I'd like to request this again (ref ${q.quoteNumber}): ${summary}`,
    });
    return `/contact?${params.toString()}`;
  };

  if (isLoading || !buyer) {
    return <div className="min-h-[60vh]" />;
  }

  return (
    <section className="bg-paper px-6 py-28 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-medium text-navy-deeper">{dict.dashboardHeading}</h1>
            <p className="mt-1 text-sm text-ink/60">
              {dict.dashboardWelcome}, {buyer.name}
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="rounded-full border border-navy/20 px-5 py-2 text-sm font-semibold text-navy hover:bg-navy/5"
          >
            {dict.logout}
          </button>
        </div>

        {!buyer.emailVerified && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <span>{dict.unverifiedBanner}</span>
            {resendStatus === "sent" ? (
              <span className="text-xs font-semibold text-amber-700">{dict.resendSent}</span>
            ) : (
              <button
                onClick={async () => {
                  setResendStatus("sending");
                  await resendVerification();
                  setResendStatus("sent");
                }}
                disabled={resendStatus === "sending"}
                className="shrink-0 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-60"
              >
                {dict.resendVerification}
              </button>
            )}
          </div>
        )}

        {dataLoading ? (
          <div className="mt-10 text-sm text-ink/50">…</div>
        ) : (
          <>
            <section className="mt-10">
              <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
                {dict.myQuotations}
              </h2>
              {quotations.length === 0 ? (
                <p className="mt-4 text-sm text-ink/50">{dict.noQuotations}</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {quotations.map((q) => (
                    <div
                      key={q.id}
                      className="flex flex-col gap-3 rounded-2xl border border-black/[0.08] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-navy-deeper">{q.quoteNumber}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLES[q.status] || ""}`}>
                            {q.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-ink/60">
                          {dict.total}: {q.currency} {quotationTotal(q).toFixed(2)}
                          {q.validUntil && (
                            <span className="ml-3">
                              {dict.validUntil}: {new Date(q.validUntil).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(q)}
                          disabled={downloadingId === q.id}
                          className="rounded-full border border-navy/20 px-4 py-2 text-xs font-semibold text-navy hover:bg-navy/5 disabled:opacity-50"
                        >
                          {dict.downloadPdf}
                        </button>
                        {q.status === "accepted" && (
                          <Link
                            href={requestAgainHref(q)}
                            className="rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-deeper"
                          >
                            {dict.requestAgain}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-12">
              <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-navy/60">
                {dict.myInquiries}
              </h2>
              {leads.length === 0 ? (
                <p className="mt-4 text-sm text-ink/50">{dict.noInquiries}</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {leads.map((l) => (
                    <div key={l.id} className="rounded-2xl border border-black/[0.08] bg-white p-5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-navy-deeper">{l.subject || l.sector}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[l.status] || ""}`}>
                          {l.status}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-ink/60">{l.message}</p>
                      <p className="mt-1.5 text-xs text-ink/40">{new Date(l.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </section>
  );
}
