"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { resolveImageUrl } from "@/lib/cms";

const keywordPositions = [
  "left-[6%] top-[26%] md:left-[8%] md:top-[24%]",
  "right-[6%] top-[20%] md:right-[10%] md:top-[18%]",
  "left-[8%] bottom-[30%] md:left-[12%] md:bottom-[26%]",
  "right-[4%] bottom-[36%] md:right-[8%] md:bottom-[30%]",
  "left-[4%] top-[52%] md:left-[6%] md:top-[50%]",
  "right-[5%] top-[48%] md:right-[9%] md:top-[46%]",
];

const defaultEyebrow = "One Company · Multiple Sectors · One Connected Business";
const defaultHeadlineWords = ["Building.", "Supplying.", "Exporting.", "Connecting."];
const defaultSubtitle =
  "ANIKA TRADING & CO. connects Bangladesh’s capabilities with projects, supply chains and international markets.";
const defaultBgImage = "/images/hero-port-supply-route.jpg";
const defaultKeywords = [
  "EXPORT",
  "SEAFOOD",
  "AGRICULTURE",
  "CONSTRUCTION",
  "GOVERNMENT TENDERS",
  "SUPPLY & TRADING",
];

type HomeHeroProps = {
  eyebrow?: string;
  headlineWords?: string[];
  subtitle?: string;
  bgImage?: string;
  keywords?: string[];
};

export default function HomeHero({
  eyebrow = defaultEyebrow,
  headlineWords = defaultHeadlineWords,
  subtitle = defaultSubtitle,
  bgImage = defaultBgImage,
  keywords = defaultKeywords,
}: HomeHeroProps) {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-navy-deeper">
      <div className="absolute inset-0">
        <Image
          src={resolveImageUrl(bgImage)}
          alt="Cargo, seafood and construction converging at a Bangladesh port — the ANIKA business ecosystem"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-navy-deeper via-navy-deeper/40 to-navy-deeper/70 opacity-[0.55]" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deeper/60 via-transparent to-navy-deeper/40" />

      {/* Floating sector keywords */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {keywords.map((label, i) => (
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute ${keywordPositions[i % keywordPositions.length]} text-[11px] font-medium tracking-[0.25em] text-white/50`}
          >
            {label}
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-[11px] font-semibold uppercase tracking-[0.35em] text-teal-light"
        >
          {eyebrow}
        </motion.p>

        <h1 className="mt-6 max-w-4xl px-2 font-display text-[2.35rem] font-medium leading-[1.05] text-white sm:text-[3.4rem] sm:leading-[1] md:text-[6.2vw] md:leading-[0.98] lg:text-[80px]">
          {headlineWords.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="block md:inline-block md:mr-3 md:last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7 }}
          className="mt-7 max-w-xl text-balance text-[15px] leading-relaxed text-white/70 md:text-base"
        >
          {subtitle}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Scroll</span>
        <span className="relative h-9 w-[1.5px] overflow-hidden bg-white/20">
          <motion.span
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-teal-light"
          />
        </span>
      </motion.div>
    </section>
  );
}
