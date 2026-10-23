import { countCharacters, sanitizeText } from "./sanitize.ts";

const EMAIL_PATTERN = /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?$/iu;
const ALLOWED_FIELDS = new Set(["name", "email", "subject", "message", "website"]);

export function isValidEmail(value: string): boolean {
    return value.length <= 254 && EMAIL_PATTERN.test(value);
}

export function validateContactPayload(payload: unknown) {
    if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
        return { ok: false as const, errors: { form: "Invalid payload." } };
    }

    const record = payload as Record<string, unknown>;
    if (Object.keys(record).some((field) => !ALLOWED_FIELDS.has(field))) {
        return { ok: false as const, errors: { form: "Unexpected field." } };
    }

    const errors: Record<string, string> = {};
    const name = typeof record.name === "string" ? sanitizeText(record.name) : "";
    const email = typeof record.email === "string" ? sanitizeText(record.email) : "";
    const subject = typeof record.subject === "string" ? sanitizeText(record.subject) : "";
    const message = typeof record.message === "string" ? sanitizeText(record.message, true) : "";

    if (countCharacters(name) < 2 || countCharacters(name) > 80) {
        errors.name = "Name must be between 2 and 80 characters.";
    }
    if (!isValidEmail(email)) {
        errors.email = "Enter a valid email address.";
    }
    if (countCharacters(subject) < 2 || countCharacters(subject) > 150) {
        errors.subject = "Subject must be between 2 and 150 characters.";
    }
    if (countCharacters(message) < 10 || countCharacters(message) > 4000) {
        errors.message = "Message must be between 10 and 4,000 characters.";
    }
    if (record.website !== undefined && typeof record.website !== "string") {
        errors.website = "Invalid payload.";
    }

    if (Object.keys(errors).length > 0) {
        return { ok: false as const, errors };
    }

    return {
        ok: true as const,
        data: { name, email, subject, message },
    };
}
