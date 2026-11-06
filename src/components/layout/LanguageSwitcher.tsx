"use client";

import { useState, useRef, useEffect } from "react";
import { locales, localeNames, localeShortLabels, LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

function applyLocale(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000`;
  window.location.reload();
}

export default function LanguageSwitcher({ locale, dark }: { locale: Locale; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const choose = (next: Locale) => {
    if (next === locale) {
      setOpen(false);
      return;
    }
    applyLocale(next);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold tracking-wide transition-colors",
          dark ? "border-white/30 text-white/85 hover:bg-white/10" : "border-black/15 text-ink/70 hover:bg-mist"
        )}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.5 3.5 5.7 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.7-3.5-9s1-6.5 3.5-9Z" />
        </svg>
        {localeShortLabels[locale]}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-xl shadow-navy-deeper/10"
        >
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitem"
              onClick={() => choose(l)}
              className={cn(
                "flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-mist",
                l === locale ? "font-semibold text-navy" : "text-ink/75"
              )}
            >
              {localeNames[l]}
              {l === locale && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
