type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwardedFor || request.headers.get('x-real-ip') || 'local';
}

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const windowMs = Number(process.env.RAEBURN_RATE_LIMIT_WINDOW_MS ?? 60000);
  const max = Number(process.env.RAEBURN_RATE_LIMIT_MAX ?? 120);
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  if (bucket.count > max) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
