"use client";

/**
 * Temporary "site under development" notice. Self-contained on purpose —
 * delete this file and its one usage in src/app/layout.tsx to remove it
 * once the site is ready; nothing else depends on it.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DISMISS_KEY = "anika_maintenance_banner_dismissed";
const SHRINK_AFTER_MS = 5000;

export default function MaintenanceBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = !!sessionStorage.getItem(DISMISS_KEY);
    } catch {
      dismissed = false;
    }
    // sessionStorage only exists client-side, so this can't be resolved
    // during the initial render without a server/client mismatch — the
    // mount-time reveal here is the standard pattern for that.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(!dismissed);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setExpanded(false), SHRINK_AFTER_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          className={`fixed inset-x-0 bottom-0 z-[100] flex px-4 pb-4 sm:px-6 ${
            expanded ? "justify-center" : "justify-end"
          }`}
        >
          <motion.div
            layout
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => !expanded && setExpanded(true)}
            className={`flex items-center rounded-2xl border border-white/10 bg-navy-deeper shadow-2xl shadow-navy-deeper/40 ${
              expanded
                ? "w-full max-w-4xl gap-4 px-7 py-6"
                : "cursor-pointer gap-3 px-4 py-3"
            }`}
          >
            <motion.span
              layout
              aria-hidden
              className={`flex shrink-0 items-center justify-center rounded-full bg-teal-light/15 text-teal-light ${
                expanded ? "h-12 w-12" : "h-8 w-8"
              }`}
            >
              <svg
                width={expanded ? 22 : 16}
                height={expanded ? 22 : 16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.14A2 2 0 0 0 3.82 21h16.36a2 2 0 0 0 1.71-3l-8.18-14.14a2 2 0 0 0-3.42 0Z"
                />
              </svg>
            </motion.span>

            <motion.div layout="position" className="flex-1">
              {expanded ? (
                <>
                  <p className="text-[15px] font-semibold text-white sm:text-base">
                    This website is under development.
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-white/70 sm:text-sm">
                    Some content and features may be incomplete or change without notice while we finish
                    building things out.
                  </p>
                </>
              ) : (
                <p className="whitespace-nowrap text-[12px] font-semibold text-white/85">
                  Site under development
                </p>
              )}
            </motion.div>

            <motion.button
              layout
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
              aria-label="Dismiss notice"
              className="shrink-0 rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
