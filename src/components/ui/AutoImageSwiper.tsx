"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { resolveImageUrl } from "@/lib/cms";

// Drop-in replacement for a single <Image fill> inside a `relative` parent —
// when given more than one image it automatically crossfades between them
// on a timer (no controls, no user interaction); with zero or one image it
// behaves exactly like a plain <Image fill>. Each mount starts at the first
// image, so switching to a new card/slide (which remounts this via `key`)
// always begins on that item's primary photo.
export default function AutoImageSwiper({
  images,
  alt,
  sizes,
  className,
  priority,
  intervalMs = 3500,
}: {
  images: string[];
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(id);
  }, [count, intervalMs]);

  if (count === 0) return null;

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={resolveImageUrl(images[index])}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={className}
        />
      </motion.div>
    </AnimatePresence>
  );
}
