import assert from "node:assert/strict";
import { test } from "node:test";

import { createCorsHandler, isAllowedOrigin } from "../../_shared/cors.ts";
import { sendContactNotification } from "../../_shared/email.ts";
import { createRateLimiter } from "../../_shared/rateLimit.ts";
import { validateContactPayload } from "../../_shared/validation.ts";
import { createSubmitContactHandler } from "../../submit-contact/handler.ts";

const validPayload = {
    name: "  Subhadeep Adhikary  ",
    email: "  subhadeep@example.com  ",
    subject: "  Portfolio enquiry  ",
    message: "  I would like to discuss a project with you.  ",
};

function createDependencies(overrides = {}) {
    const inserted: Record<string, string>[] = [];
    const sent: Record<string, string>[] = [];
    const dependencies = {
        rateLimiter: createRateLimiter(),
        emailConfiguration: {
            apiKey: "test-key",
            fromEmail: "portfolio@example.com",
            recipientEmail: "owner@example.com",
        },
        insertMessage: async (message: Record<string, string>) => {
            inserted.push(message);
        },
        sendNotification: async (message: Record<string, string>) => {
            sent.push(message);
        },
        now: () => new Date("2026-10-08T00:00:00.000Z"),
        createId: () => "46b8d819-0826-4cf8-8c75-7d08c1ed39ab",
        ...overrides,
    };

    return { handler: createSubmitContactHandler(dependencies), inserted, sent };
}

function post(payload: unknown, headers: Record<string, string> = {}) {
    return new Request("https://portfolio.example/functions/v1/submit-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(payload),
    });
}

test("rejects an empty name", () => {
    const result = validateContactPayload({ ...validPayload, name: " " });
    assert.equal(result.ok, false);
    if (!result.ok) {
        assert.ok(result.errors.name);
    }
});

test("rejects an invalid email", () => {
    const result = validateContactPayload({ ...validPayload, email: "not-an-email" });
    assert.equal(result.ok, false);
    if (!result.ok) {
        assert.ok(result.errors.email);
    }
});

test("rejects an empty subject", () => {
    const result = validateContactPayload({ ...validPayload, subject: "" });
    assert.equal(result.ok, false);
    if (!result.ok) {
        assert.ok(result.errors.subject);
    }
});

test("rejects an empty or too-short message", () => {
    const result = validateContactPayload({ ...validPayload, message: "" });
    assert.equal(result.ok, false);
    if (!result.ok) {
        assert.ok(result.errors.message);
    }
});

test("rejects oversized input", () => {
    const result = validateContactPayload({ ...validPayload, message: "m".repeat(4001) });
    assert.equal(result.ok, false);
    if (!result.ok) {
        assert.ok(result.errors.message);
    }
});

test("trims a valid payload and stores it before sending the notification", async () => {
    const { handler, inserted, sent } = createDependencies();
    const response = await handler(post(validPayload));

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, notification: "sent" });
    assert.equal(inserted.length, 1);
    assert.equal(sent.length, 1);
    assert.equal(inserted[0].name, "Subhadeep Adhikary");
    assert.equal(inserted[0].created_at, "2026-10-08T00:00:00.000Z");
});

test("stores a message and reports when email delivery is not configured", async () => {
    const { handler, inserted, sent } = createDependencies({
        emailConfiguration: { apiKey: "", fromEmail: "", recipientEmail: "" },
    });
    const response = await handler(post(validPayload));

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, notification: "not_configured" });
    assert.equal(inserted.length, 1);
    assert.equal(sent.length, 0);
});

test("keeps a stored message successful when notification delivery fails", async () => {
    const { handler, inserted, sent } = createDependencies({
        sendNotification: async (message: Record<string, string>) => {
            sent.push(message);
            throw new Error("Provider unavailable.");
        },
    });
    const response = await handler(post(validPayload));

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, notification: "failed" });
    assert.equal(inserted.length, 1);
    assert.equal(sent.length, 1);
});

test("escapes visitor content in HTML and keeps notification headers fixed", async () => {
    const originalFetch = globalThis.fetch;
    let capturedUrl = "";
    let capturedInit: RequestInit | undefined;
    globalThis.fetch = async (input, init) => {
        capturedUrl = String(input);
        capturedInit = init;
        return new Response("{}", { status: 200 });
    };

    try {
        const contact = {
            id: "46b8d819-0826-4cf8-8c75-7d08c1ed39ab",
            name: "<script>alert(1)</script>",
            email: "demo@example.com",
            subject: "Portfolio enquiry",
            message: "Hello <script>alert(1)</script>",
            created_at: "2026-10-08T00:00:00.000Z",
        };
        await sendContactNotification(contact, {
            apiKey: "local-test-key",
            fromEmail: "portfolio@example.com",
            recipientEmail: "owner@example.com",
        });

        const body = JSON.parse(String(capturedInit?.body));
        assert.equal(capturedUrl, "https://api.resend.com/emails");
        assert.equal(body.subject, "New portfolio contact submission");
        assert.equal(body.reply_to, contact.email);
        assert.ok(body.html.includes("&lt;script&gt;"));
        assert.equal(body.html.includes("<script>"), false);
        assert.ok(body.text.includes("Hello <script>alert(1)</script>"));
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test("silently accepts a populated honeypot without storing or emailing", async () => {
    const { handler, inserted, sent } = createDependencies();
    const response = await handler(post({ ...validPayload, website: "https://spam.example" }));

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(inserted.length, 0);
    assert.equal(sent.length, 0);
});

test("rejects malformed JSON", async () => {
    const { handler } = createDependencies();
    const response = await handler(
        new Request("https://portfolio.example/functions/v1/submit-contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{invalid",
        }),
    );

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, error: "Invalid request." });
});

test("rejects unsupported methods", async () => {
    const { handler } = createDependencies();
    const response = await handler(
        new Request("https://portfolio.example/functions/v1/submit-contact", { method: "GET" }),
    );

    assert.equal(response.status, 405);
    assert.equal(response.headers.get("Allow"), "POST, OPTIONS");
    assert.deepEqual(await response.json(), { ok: false, error: "Method not allowed." });
});

test("rejects missing, whitespace-only, or oversized fields without storing", async () => {
    const invalidPayloads = [
        { email: "person@example.com", subject: "Question", message: "A valid message body." },
        { ...validPayload, name: "   " },
        { name: "Valid Name", subject: "Question", message: "A valid message body." },
        { ...validPayload, email: "not-an-email" },
        { name: "Valid Name", email: "person@example.com", message: "A valid message body." },
        { ...validPayload, subject: "   " },
        { name: "Valid Name", email: "person@example.com", subject: "Question" },
        { ...validPayload, message: "   " },
        { ...validPayload, name: "N".repeat(81) },
        { ...validPayload, email: `${"a".repeat(250)}@example.com` },
        { ...validPayload, subject: "S".repeat(151) },
        { ...validPayload, message: "M".repeat(4001) },
    ];

    for (const payload of invalidPayloads) {
        const { handler, inserted, sent } = createDependencies();
        const response = await handler(post(payload));

        assert.equal(response.status, 400);
        assert.deepEqual(await response.json(), {
            ok: false,
            error: "Please check your entries and try again.",
        });
        assert.equal(inserted.length, 0);
        assert.equal(sent.length, 0);
    }
});

test("limits repeated submissions by key and resets after its window", () => {
    let currentTime = 1000;
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 500, now: () => currentTime });

    assert.equal(limiter.check("ip:127.0.0.1").allowed, true);
    assert.equal(limiter.check("ip:127.0.0.1").allowed, true);
    const blocked = limiter.check("ip:127.0.0.1");
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.retryAfterSeconds, 1);

    currentTime += 500;
    assert.equal(limiter.check("ip:127.0.0.1").allowed, true);
});

test("allows production and local Vite dev/preview origins while rejecting other origins", () => {
    assert.equal(isAllowedOrigin("https://subhadeep1357.github.io"), true);
    assert.equal(isAllowedOrigin("http://127.0.0.1:5173"), true);
    assert.equal(isAllowedOrigin("http://localhost:5174"), true);
    assert.equal(isAllowedOrigin("http://localhost:4173"), true);
    assert.equal(isAllowedOrigin("http://127.0.0.1:4175"), true);
    assert.equal(isAllowedOrigin("https://attacker.example"), false);
});

test("handles CORS preflight and rejects an unapproved origin", async () => {
    const handler = createCorsHandler(async () => new Response("ok"));
    const preflight = await handler(
        new Request("https://portfolio.example/functions/v1/submit-contact", {
            method: "OPTIONS",
            headers: { Origin: "http://127.0.0.1:5173" },
        }),
    );
    const blocked = await handler(
        new Request("https://portfolio.example/functions/v1/submit-contact", {
            method: "POST",
            headers: { Origin: "https://attacker.example" },
        }),
    );

    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get("Access-Control-Allow-Origin"), "http://127.0.0.1:5173");
    assert.equal(blocked.status, 403);
});
