type RateLimitEntry = { count: number; resetAt: number };

type RateLimitOptions = {
    maxRequests?: number;
    windowMs?: number;
    maxEntries?: number;
    now?: () => number;
};

export function createRateLimiter(options: RateLimitOptions = {}) {
    const maxRequests = options.maxRequests ?? 5;
    const windowMs = options.windowMs ?? 15 * 60 * 1000;
    const maxEntries = options.maxEntries ?? 5000;
    const now = options.now ?? Date.now;
    const entries = new Map<string, RateLimitEntry>();

    return {
        check(key: string) {
            const currentTime = now();
            const current = entries.get(key);

            if (current && current.resetAt > currentTime) {
                if (current.count >= maxRequests) {
                    return {
                        allowed: false,
                        retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - currentTime) / 1000)),
                    };
                }

                current.count += 1;
                return { allowed: true, retryAfterSeconds: 0 };
            }

            if (entries.size >= maxEntries) {
                for (const [entryKey, entry] of entries) {
                    if (entry.resetAt <= currentTime) {
                        entries.delete(entryKey);
                    }
                }
                if (entries.size >= maxEntries) {
                    const oldestKey = entries.keys().next().value;
                    if (oldestKey !== undefined) {
                        entries.delete(oldestKey);
                    }
                }
            }

            entries.set(key, { count: 1, resetAt: currentTime + windowMs });
            return { allowed: true, retryAfterSeconds: 0 };
        },
    };
}

function getClientAddress(request: Request): string | null {
    const cloudflareAddress = request.headers.get("cf-connecting-ip")?.trim();
    if (cloudflareAddress && !cloudflareAddress.includes(",")) {
        return cloudflareAddress;
    }

    const forwardedAddresses = request.headers.get("x-forwarded-for");
    const forwardedAddress = forwardedAddresses?.split(",").at(-1)?.trim();
    return forwardedAddress || null;
}

export function getRateLimitKeys(request: Request, email: string): string[] {
    const address = getClientAddress(request);
    const keys = [`email:${email.toLowerCase()}`];

    if (address) {
        keys.unshift(`ip:${address}`);
    }
    return keys;
}
