import { getRateLimitKeys } from "../_shared/rateLimit.ts";
import { sanitizeText } from "../_shared/sanitize.ts";
import { isValidEmail, validateContactPayload } from "../_shared/validation.ts";

const MAX_REQUEST_BYTES = 16 * 1024;
const GENERIC_FAILURE = "Something went wrong. Please try again.";

type HandlerDependencies = {
    rateLimiter: { check: (key: string) => { allowed: boolean; retryAfterSeconds: number } };
    emailConfiguration: { apiKey: string; fromEmail: string; recipientEmail: string };
    insertMessage: (message: Record<string, string>) => Promise<void>;
    sendNotification: (message: Record<string, string>) => Promise<void>;
    now?: () => Date;
    createId?: () => string;
};

function jsonResponse(body: unknown, status: number, extraHeaders: HeadersInit = {}): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            ...Object.fromEntries(new Headers(extraHeaders)),
        },
    });
}

async function readRequestBody(request: Request) {
    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
        return { ok: false as const, tooLarge: true };
    }

    if (!request.body) {
        return { ok: true as const, text: "" };
    }

    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            totalBytes += value.byteLength;
            if (totalBytes > MAX_REQUEST_BYTES) {
                await reader.cancel();
                return { ok: false as const, tooLarge: true };
            }
            chunks.push(value);
        }

        const body = new Uint8Array(totalBytes);
        let offset = 0;
        chunks.forEach((chunk) => {
            body.set(chunk, offset);
            offset += chunk.byteLength;
        });

        return { ok: true as const, text: new TextDecoder("utf-8", { fatal: true }).decode(body) };
    } catch {
        return { ok: false as const, tooLarge: false };
    }
}

function hasEmailConfiguration(configuration: HandlerDependencies["emailConfiguration"]): boolean {
    return Boolean(
        configuration.apiKey.trim() &&
            isValidEmail(configuration.fromEmail.trim()) &&
            isValidEmail(configuration.recipientEmail.trim()),
    );
}

export function createSubmitContactHandler(dependencies: HandlerDependencies) {
    const now = dependencies.now ?? (() => new Date());
    const createId = dependencies.createId ?? (() => crypto.randomUUID());

    return async (request: Request): Promise<Response> => {
        if (request.method !== "POST") {
            return jsonResponse({ ok: false, error: "Method not allowed." }, 405, { Allow: "POST, OPTIONS" });
        }

        const mediaType = request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
        if (mediaType !== "application/json") {
            return jsonResponse({ ok: false, error: "A JSON request is required." }, 415);
        }

        const body = await readRequestBody(request);
        if (!body.ok) {
            const status = body.tooLarge ? 413 : 400;
            return jsonResponse({ ok: false, error: "Invalid request." }, status);
        }

        let payload: unknown;
        try {
            payload = JSON.parse(body.text);
        } catch {
            return jsonResponse({ ok: false, error: "Invalid request." }, 400);
        }

        if (
            payload !== null &&
            typeof payload === "object" &&
            !Array.isArray(payload) &&
            typeof (payload as Record<string, unknown>).website === "string" &&
            sanitizeText((payload as Record<string, string>).website) !== ""
        ) {
            // Silently accept the form shape so bots don't learn about the trap.
            return jsonResponse({ ok: true }, 200);
        }

        const validated = validateContactPayload(payload);
        if (!validated.ok) {
            return jsonResponse({ ok: false, error: "Please check your entries and try again." }, 400);
        }

        for (const key of getRateLimitKeys(request, validated.data.email)) {
            const result = dependencies.rateLimiter.check(key);
            if (!result.allowed) {
                return jsonResponse(
                    { ok: false, error: "Too many submissions. Please wait before trying again." },
                    429,
                    { "Retry-After": String(result.retryAfterSeconds) },
                );
            }
        }

        const createdAt = now().toISOString();
        const contactMessage = {
            id: createId(),
            ...validated.data,
            created_at: createdAt,
        };

        try {
            await dependencies.insertMessage(contactMessage);
        } catch {
            console.error("Contact message persistence failed.");
            return jsonResponse({ ok: false, error: GENERIC_FAILURE }, 500);
        }

        if (!hasEmailConfiguration(dependencies.emailConfiguration)) {
            console.error("Contact notification is not configured.");
            return jsonResponse({ ok: true, notification: "not_configured" }, 200);
        }

        try {
            await dependencies.sendNotification(contactMessage);
            return jsonResponse({ ok: true, notification: "sent" }, 200);
        } catch {
            console.error("Contact notification delivery failed.");
            return jsonResponse({ ok: true, notification: "failed" }, 200);
        }
    };
}
