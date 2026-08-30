"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent, MotionValue } from "framer-motion";
import type { RefObject } from "react";

/**
 * Tracks scroll progress through a tall container and derives a discrete
 * "active index" (0..count-1) plus the raw 0-1 progress value, so a sticky
 * panel inside the container can swap content in sync with scroll position.
 */
export function useStickyIndex(
  ref: RefObject<HTMLElement | null>,
  count: number
): { active: number; progress: MotionValue<number> } {
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(count - 1, Math.max(0, Math.floor(v * count)));
    setActive((prev) => (prev !== idx ? idx : prev));
  });

  return { active, progress: scrollYProgress };
}
