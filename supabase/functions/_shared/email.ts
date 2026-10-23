import { escapeHtml } from "./sanitize.ts";

type ContactMessage = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
};

type EmailConfiguration = {
    apiKey: string;
    fromEmail: string;
    recipientEmail: string;
};

function toHtmlLines(value: string): string {
    return escapeHtml(value).replace(/\n/gu, "<br />");
}

export async function sendContactNotification(
    contact: ContactMessage,
    configuration: EmailConfiguration,
): Promise<void> {
    const text = [
        "NEW PORTFOLIO CONTACT",
        "",
        "Name:",
        contact.name,
        "Email:",
        contact.email,
        "Subject:",
        contact.subject,
        "",
        "Message:",
        contact.message,
        "",
        "Received:",
        contact.created_at,
    ].join("\n");

    const html = `
        <div style="background:#050505;color:#f5f3ed;font-family:Arial,sans-serif;padding:28px;">
            <h1 style="color:#d4af37;font-size:20px;letter-spacing:.08em;">NEW PORTFOLIO CONTACT</h1>
            <dl>
                <dt><strong>Name</strong></dt><dd>${escapeHtml(contact.name)}</dd>
                <dt><strong>Email</strong></dt><dd>${escapeHtml(contact.email)}</dd>
                <dt><strong>Subject</strong></dt><dd>${escapeHtml(contact.subject)}</dd>
                <dt><strong>Message</strong></dt><dd>${toHtmlLines(contact.message)}</dd>
                <dt><strong>Received</strong></dt><dd>${escapeHtml(contact.created_at)}</dd>
            </dl>
        </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${configuration.apiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": contact.id,
        },
        body: JSON.stringify({
            from: `Subhadeep Adhikary Portfolio <${configuration.fromEmail}>`,
            to: [configuration.recipientEmail],
            reply_to: contact.email,
            subject: "New portfolio contact submission",
            text,
            html,
        }),
        signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
        throw new Error(`Resend rejected notification (${response.status}).`);
    }
}
