"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks as defaultNavLinks } from "@/data/site";
import { cn } from "@/lib/utils";

type NavLink = { label: string; href: string };

export default function Navbar({ navLinks = defaultNavLinks }: { navLinks?: NavLink[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation. Adjusted during render (rather than
  // in an effect) per https://react.dev/learn/you-might-not-need-an-effect
  // so it takes effect in the same render pass instead of an extra one.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const solid = scrolled || !isHome || open;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-500",
        solid ? "bg-paper/90 backdrop-blur-md border-b border-black/5" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/anika-official-logo.png"
            alt="ANIKA Trading & Co."
            width={34}
            height={41}
            className="h-8 w-auto"
            priority
          />
          <span
            className={cn(
              "font-display text-[13px] font-semibold tracking-[0.18em] transition-colors",
              solid ? "text-navy-deeper" : "text-white"
            )}
          >
            ANIKA TRADING&nbsp;&amp;&nbsp;CO.
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-[13px] font-medium tracking-wide transition-colors",
                  solid ? "text-ink/70 hover:text-navy" : "text-white/80 hover:text-white",
                  active && (solid ? "text-navy" : "text-white")
                )}
              >
                {link.label.toUpperCase()}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-[2px] w-full brand-gradient-bg" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[12px] font-semibold tracking-wide transition-all",
              solid
                ? "border-navy text-navy hover:bg-navy hover:text-white"
                : "border-white/50 text-white hover:bg-white hover:text-navy-deeper"
            )}
          >
            REQUEST A QUOTE
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className={cn(
              "h-[1.5px] w-6 transition-all",
              solid ? "bg-ink" : "bg-white",
              open && "translate-y-[6.5px] rotate-45"
            )}
          />
          <span
            className={cn(
              "h-[1.5px] w-6 transition-all",
              solid ? "bg-ink" : "bg-white",
              open && "opacity-0"
            )}
          />
          <span
            className={cn(
              "h-[1.5px] w-6 transition-all",
              solid ? "bg-ink" : "bg-white",
              open && "-translate-y-[6.5px] -rotate-45"
            )}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-black/5 bg-paper md:hidden"
          >
            <nav className="flex flex-col gap-1 px-5 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2.5 text-[15px] font-medium text-ink/80 hover:text-navy"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center justify-center rounded-full bg-navy px-5 py-3 text-[13px] font-semibold text-white"
              >
                REQUEST A QUOTE
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
