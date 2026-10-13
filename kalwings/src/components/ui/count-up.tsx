"use client";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Counts up to `value`. When value is null (no real number yet) renders an
 * obvious "[X]" placeholder — we never invent figures.
 */
export function CountUp({ value, suffix = "" }: { value: number | null; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (value == null || !inView) return;
    if (reduce) return setN(value);
    const c = animate(0, value, { duration: 1.6, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value, reduce]);

  if (value == null) return <span ref={ref} title="Placeholder — add the real figure in src/data/sample.ts">[X]{suffix}</span>;
  return <span ref={ref}>{n.toLocaleString("en-IN")}{suffix}</span>;
}
