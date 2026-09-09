"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { resolveImageUrl } from "@/lib/cms";

type HomeCTAProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bgImage?: string;
};

export default function HomeCTA({
  eyebrow = "Business Inquiry",
  heading = "Let’s Build the Next Opportunity Together.",
  description = "Whether you are looking for products from Bangladesh, exploring a supply requirement, discussing a project or seeking a business partnership, talk to ANIKA.",
  primaryCtaText = "START A CONVERSATION",
  primaryCtaLink = "/contact",
  secondaryCtaText = "EXPLORE EXPORT PRODUCTS",
  secondaryCtaLink = "/export",
  bgImage = "/images/final-cta-port.jpg",
}: HomeCTAProps) {
  return (
    <section className="relative flex min-h-[85vh] w-full items-center overflow-hidden bg-navy-deeper">
      <Image
        src={resolveImageUrl(bgImage)}
        alt="ANIKA port operations at dusk"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper via-navy-deeper/75 to-navy-deeper/50" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-light"
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 font-display text-[34px] font-medium leading-[1.1] text-white sm:text-[44px] md:text-[54px]"
        >
          {heading}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-white/65"
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href={primaryCtaLink}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[13px] font-semibold tracking-wide text-navy-deeper transition-transform hover:scale-[1.03]"
          >
            {primaryCtaText}
          </Link>
          <Link
            href={secondaryCtaLink}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-white/10"
          >
            {secondaryCtaText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
