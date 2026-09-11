import type { ReactNode } from "react";

/**
 * Layout wrapper that used to fade content in on scroll. Scroll animations
 * were removed site-wide for a simple, predictable scroll, so this now renders
 * its children as-is. `delay` and `y` are accepted and ignored so existing
 * call sites don't need to change.
 */
export default function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
