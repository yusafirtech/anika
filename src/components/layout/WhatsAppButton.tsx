"use client";

import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n/dictionaries";

const defaultDict: Dictionary["whatsapp"] = {
  ariaLabel: "Chat with us on WhatsApp",
  message: "Hello ANIKA TRADING & CO., I'd like to know more about your products.",
};

export default function WhatsAppButton({ phone, dict = defaultDict }: { phone: string; dict?: Dictionary["whatsapp"] }) {
  const pathname = usePathname();
  const digits = phone.replace(/[^\d]/g, "");
  if (!digits) return null;

  // Hidden on the admin-style maintenance/contact form page itself to avoid
  // competing with the inline "Phone / WhatsApp" field there.
  if (pathname === "/contact") return null;

  const message = encodeURIComponent(dict.message);

  return (
    <a
      href={`https://wa.me/${digits}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.ariaLabel}
      className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] md:right-7"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.13L2 22l5.12-1.5a9.84 9.84 0 0 0 4.92 1.32h.01c5.46 0 9.9-4.45 9.9-9.91A9.82 9.82 0 0 0 12.04 2Zm5.8 14.03c-.25.7-1.44 1.33-1.98 1.4-.5.08-1.14.11-1.84-.11-.42-.14-.96-.32-1.65-.62-2.9-1.25-4.8-4.17-4.94-4.37-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.17.01.42-.07.65.5.25.6.84 2.07.91 2.22.07.15.12.33.02.52-.1.2-.15.33-.3.5-.15.18-.31.4-.45.54-.15.14-.3.3-.13.6.17.3.78 1.28 1.68 2.07 1.15 1.03 2.11 1.35 2.42 1.5.3.14.48.12.66-.07.19-.2.78-.9.99-1.21.2-.3.41-.25.68-.15.28.1 1.76.83 2.06.98.3.15.5.22.57.35.08.13.08.74-.17 1.45Z" />
      </svg>
    </a>
  );
}
