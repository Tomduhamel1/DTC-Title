// Simple in-memory token bucket. Per-instance only — fine for beta single-instance
// deploys. Swap for Upstash Redis when going multi-region or scaling out.

const buckets = new Map<string, number[]>()

export interface RateLimitResult {
  ok: boolean
  remaining: number
  resetMs: number
}

/**
 * Returns ok=false if `key` has exceeded `max` calls in `windowMs`.
 * Stores timestamps in a sliding window; expired entries are pruned on access.
 */
export function rateLimit(key: string, max: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const cutoff = now - windowMs
  const arr = buckets.get(key) ?? []
  const recent = arr.filter((t) => t > cutoff)

  if (recent.length >= max) {
    const oldest = recent[0]
    return {
      ok: false,
      remaining: 0,
      resetMs: Math.max(0, oldest + windowMs - now),
    }
  }

  recent.push(now)
  buckets.set(key, recent)

  // Best-effort GC: every 1k inserts, sweep expired buckets
  if (Math.random() < 0.001) {
    for (const [k, v] of buckets) {
      const fresh = v.filter((t) => t > cutoff)
      if (fresh.length === 0) buckets.delete(k)
      else buckets.set(k, fresh)
    }
  }

  return { ok: true, remaining: max - recent.length, resetMs: windowMs }
}
