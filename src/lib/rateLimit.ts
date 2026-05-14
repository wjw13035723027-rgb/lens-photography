interface RateLimitOptions {
  limit: number;
  windowMs: number;
  getNow?: () => number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function isRateLimited(key: string, options: RateLimitOptions) {
  const now = options.getNow?.() ?? Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > options.limit;
}

export function rateLimitKey(request: Request, scope: string) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  return `${scope}:${ip}`;
}

export function clearRateLimitForTests() {
  buckets.clear();
}
