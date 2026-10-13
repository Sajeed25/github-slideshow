/**
 * Fixed-window in-memory limiter. Fine for a single instance / dev.
 * For multi-instance production, swap the Map for Redis/Upstash (same signature).
 */
const hits = new Map<string, { n: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || h.reset < now) {
    hits.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  h.n += 1;
  return h.n <= limit;
}
