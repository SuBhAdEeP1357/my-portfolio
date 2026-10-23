import { withSupabase } from "npm:@supabase/server@^1";

import { createCorsHandler } from "../_shared/cors.ts";
import { sendContactNotification } from "../_shared/email.ts";
import { createRateLimiter } from "../_shared/rateLimit.ts";
import { createSubmitContactHandler } from "./handler.ts";

const rateLimiter = createRateLimiter({ maxRequests: 5, windowMs: 15 * 60 * 1000 });

const submitContact = withSupabase(
    { auth: "publishable", cors: "disabled" },
    async (request, { supabaseAdmin }) => {
        const emailConfiguration = {
            apiKey: Deno.env.get("RESEND_API_KEY") ?? "",
            fromEmail: Deno.env.get("RESEND_FROM_EMAIL") ?? "",
            recipientEmail: Deno.env.get("CONTACT_NOTIFICATION_EMAIL") ?? "",
        };

        const handleRequest = createSubmitContactHandler({
            rateLimiter,
            emailConfiguration,
            insertMessage: async (message) => {
                const { error } = await supabaseAdmin.from("contact_messages").insert(message);
                if (error) {
                    throw new Error("Could not store the contact message.");
                }
            },
            sendNotification: (message) => sendContactNotification(message, emailConfiguration),
        });

        return handleRequest(request);
    },
);

Deno.serve(createCorsHandler(submitContact));
