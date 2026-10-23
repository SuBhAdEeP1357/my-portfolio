const PRODUCTION_ORIGINS = new Set(["https://subhadeep1357.github.io"]);
const LOCAL_VITE_PORT_RANGES = [
    [4173, 4199],
    [5173, 5199],
];

const BASE_CORS_HEADERS = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
        "authorization, apikey, x-client-info, content-type, x-retry-count, traceparent, tracestate, baggage",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
};

export function isAllowedOrigin(origin: string): boolean {
    if (PRODUCTION_ORIGINS.has(origin)) {
        return true;
    }

    try {
        const url = new URL(origin);
        const hostname = url.hostname.replace(/^\[|\]$/gu, "");
        const isLoopback = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
        const port = url.port ? Number(url.port) : Number.NaN;

        return (
            isLoopback &&
            url.protocol === "http:" &&
            Number.isInteger(port) &&
            LOCAL_VITE_PORT_RANGES.some(([min, max]) => port >= min && port <= max) &&
            url.origin === origin
        );
    } catch {
        return false;
    }
}

function jsonResponse(body: unknown, status: number, origin?: string | null): Response {
    const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });
    if (origin) {
        Object.entries(BASE_CORS_HEADERS).forEach(([name, value]) => headers.set(name, value));
        headers.set("Access-Control-Allow-Origin", origin);
    }

    return new Response(JSON.stringify(body), { status, headers });
}

export function createCorsHandler(handler: (request: Request) => Promise<Response>) {
    return async (request: Request): Promise<Response> => {
        const origin = request.headers.get("origin");
        if (origin && !isAllowedOrigin(origin)) {
            return jsonResponse({ ok: false, error: "Origin not allowed." }, 403);
        }

        if (request.method === "OPTIONS") {
            const headers = new Headers(BASE_CORS_HEADERS);
            if (origin) {
                headers.set("Access-Control-Allow-Origin", origin);
            }
            return new Response(null, { status: 204, headers });
        }

        const response = await handler(request);
        const headers = new Headers(response.headers);

        if (origin) {
            Object.entries(BASE_CORS_HEADERS).forEach(([name, value]) => headers.set(name, value));
            headers.set("Access-Control-Allow-Origin", origin);
        }

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
        });
    };
}
