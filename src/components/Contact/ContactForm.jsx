import { useRef, useState } from "react";

import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import "./ContactForm.css";

const emailPattern = /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?$/iu;

function ContactForm() {
    const [errors, setErrors] = useState({});
    const [state, setState] = useState("idle");
    const formRef = useRef(null);
    const isSubmittingRef = useRef(false);
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const subjectRef = useRef(null);
    const messageRef = useRef(null);

    function handleFieldChange(field) {
        setErrors((currentErrors) => {
            if (!currentErrors[field]) {
                return currentErrors;
            }

            const nextErrors = { ...currentErrors };
            delete nextErrors[field];
            return nextErrors;
        });
        setState("idle");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (isSubmittingRef.current) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const values = {
            name: String(formData.get("name") ?? "").trim(),
            email: String(formData.get("email") ?? "").trim(),
            subject: String(formData.get("subject") ?? "").trim(),
            message: String(formData.get("message") ?? "").trim(),
        };
        const honeypot = String(formData.get("website") ?? "").trim();
        const nextErrors = {};

        if (values.name.length < 2) {
            nextErrors.name = "Enter a name with at least 2 characters.";
        } else if (values.name.length > 80) {
            nextErrors.name = "Keep your name under 80 characters.";
        }
        if (!values.email) {
            nextErrors.email = "Please enter your email address.";
        } else if (values.email.length > 254 || !emailPattern.test(values.email)) {
            nextErrors.email = "Enter a valid email address.";
        }
        if (values.subject.length < 2) {
            nextErrors.subject = "Enter a subject with at least 2 characters.";
        } else if (values.subject.length > 150) {
            nextErrors.subject = "Keep your subject under 150 characters.";
        }
        if (values.message.length < 10) {
            nextErrors.message = "Write a message with at least 10 characters.";
        } else if (values.message.length > 4000) {
            nextErrors.message = "Keep your message under 4,000 characters.";
        }

        setErrors(nextErrors);
        setState("idle");

        if (Object.keys(nextErrors).length > 0) {
            const firstInvalidField = [
                ["name", nameRef],
                ["email", emailRef],
                ["subject", subjectRef],
                ["message", messageRef],
            ].find(([field]) => nextErrors[field]);

            firstInvalidField?.[1].current?.focus();
            return;
        }

        if (!isSupabaseConfigured || !supabase) {
            if (import.meta.env.DEV) {
                console.warn(
                    "Contact form is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
                );
            }
            setState("unconfigured");
            return;
        }

        isSubmittingRef.current = true;
        setState("submitting");

        try {
            const { data, error } = await supabase.functions.invoke("submit-contact", {
                body: { ...values, website: honeypot },
                timeout: 20_000,
            });

            if (error || !data?.ok) {
                throw new Error("Contact submission failed.");
            }

            formRef.current?.reset();
            setErrors({});
            setState("success");
        } catch {
            setState("error");
        } finally {
            isSubmittingRef.current = false;
        }
    }

    const statusMessage = {
        submitting: "Sending your message...",
        success: "Your message has been received. Thank you for reaching out.",
        error: "Something went wrong. Please try again or use the email link in the Connect section.",
        unconfigured: "The contact form is unavailable right now. Please use the email link in the Connect section.",
    }[state] ?? "";

    return (
        <form
            ref={formRef}
            className="contact-form"
            noValidate
            onSubmit={handleSubmit}
            aria-busy={state === "submitting"}
        >
            <div className="contact-form__honeypot" aria-hidden="true">
                <input
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>
            <div className="contact-form__fields">
                <div className="contact-form__field">
                    <label className="contact-form__label" htmlFor="contact-name">
                        YOUR NAME
                    </label>
                    <input
                        ref={nameRef}
                        className="contact-form__control"
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your Name"
                        minLength={2}
                        maxLength={80}
                        required
                        disabled={state === "submitting"}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                        onChange={() => handleFieldChange("name")}
                    />
                    {errors.name && (
                        <p className="contact-form__error" id="contact-name-error" role="alert">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="contact-form__field">
                    <label className="contact-form__label" htmlFor="contact-email">
                        YOUR EMAIL
                    </label>
                    <input
                        ref={emailRef}
                        className="contact-form__control"
                        id="contact-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="Your Email"
                        maxLength={254}
                        required
                        disabled={state === "submitting"}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                        onChange={() => handleFieldChange("email")}
                    />
                    {errors.email && (
                        <p className="contact-form__error" id="contact-email-error" role="alert">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div className="contact-form__field contact-form__field--wide">
                    <label className="contact-form__label" htmlFor="contact-subject">
                        SUBJECT
                    </label>
                    <input
                        ref={subjectRef}
                        className="contact-form__control"
                        id="contact-subject"
                        name="subject"
                        type="text"
                        placeholder="Subject"
                        minLength={2}
                        maxLength={150}
                        required
                        disabled={state === "submitting"}
                        aria-invalid={Boolean(errors.subject)}
                        aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                        onChange={() => handleFieldChange("subject")}
                    />
                    {errors.subject && (
                        <p className="contact-form__error" id="contact-subject-error" role="alert">
                            {errors.subject}
                        </p>
                    )}
                </div>

                <div className="contact-form__field contact-form__field--wide">
                    <label className="contact-form__label" htmlFor="contact-message">
                        MESSAGE
                    </label>
                    <textarea
                        ref={messageRef}
                        className="contact-form__control contact-form__textarea"
                        id="contact-message"
                        name="message"
                        placeholder="Write your message here..."
                        minLength={10}
                        maxLength={4000}
                        required
                        disabled={state === "submitting"}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? "contact-message-error" : undefined}
                        onChange={() => handleFieldChange("message")}
                    />
                    {errors.message && (
                        <p className="contact-form__error" id="contact-message-error" role="alert">
                            {errors.message}
                        </p>
                    )}
                </div>
            </div>

            <button
                className="portfolio-button portfolio-button--primary contact-form__submit"
                type="submit"
                disabled={state === "submitting" || state === "success"}
            >
                {state === "submitting"
                    ? "SENDING..."
                    : state === "success"
                      ? "MESSAGE SENT"
                      : "SEND MESSAGE"}
            </button>
            <p
                className="contact-form__status"
                data-state={state}
                role={state === "error" || state === "unconfigured" ? "alert" : "status"}
                aria-live={state === "error" || state === "unconfigured" ? "assertive" : "polite"}
            >
                {statusMessage}
            </p>
        </form>
    );
}

export default ContactForm;
