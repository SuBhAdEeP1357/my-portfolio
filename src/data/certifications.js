// ================================================================
// CERTIFICATIONS DATA
// ================================================================
// Centralized data source for all certificates and professional
// credentials displayed throughout the portfolio.
//
// Keep certificate metadata here so the desktop and mobile
// Certifications components can reuse the same source of truth.
//
// Asset directory:
// src/assets/images/certifications/
// ================================================================


// ---------------------------------------------------------------
// CERTIFICATE ASSETS
// ---------------------------------------------------------------
// Import the actual certificate images from the portfolio assets.
// These filenames match the files currently present in:
// src/assets/images/certifications/
// ---------------------------------------------------------------

import codeAlphaCertificate from "../assets/images/certifications/codealpha-certificate.png";
import genAITools from "../assets/images/certifications/gen-ai-tools.png";
import googleFoundationsCybersecurity from "../assets/images/certifications/google-foundations-cybersecurity.png";
import tataCybersecurityAnalyst from "../assets/images/certifications/tata-cybersecurity-analyst.png";
import tcsionGenerativeAI from "../assets/images/certifications/tcsion-generative-ai-essentials.png";


// ---------------------------------------------------------------
// CERTIFICATIONS
// ---------------------------------------------------------------
// Each object represents one credential shown in the portfolio.
//
// Supported fields:
// - id              : Unique identifier
// - title           : Credential / certificate title
// - issuer          : Organization / platform
// - date            : Date or month/year earned
// - category        : Portfolio classification
// - type            : Credential type
// - image           : Certificate image
// - credentialLabel : Text displayed on the credential action
// - credentialUrl   : Verified external credential URL
//
// Leave credentialUrl empty when a verified public credential
// URL is not available. Never add fabricated verification links.
// ---------------------------------------------------------------

const certifications = [
    // -------------------------------------------------------------
    // CodeAlpha
    // -------------------------------------------------------------
    {
        id: "codealpha-certificate",
        title: "Cybersecurity Internship Certificate",

        issuer: "CodeAlpha",

        date: "August 2026 — September 2026",

        category: "Cybersecurity",

        type: "Internship Certificate",

        image: codeAlphaCertificate,

        credentialLabel: "CREDENTIAL",

        // No public verification URL has been provided.
        credentialUrl: "",
    },


    // -------------------------------------------------------------
    // Gen AI Tools
    // -------------------------------------------------------------
    {
        id: "gen-ai-tools",
        title: "Gen AI Tools",

        issuer: "IT-ITeS Sector Skill Council | NASSCOM",

        date: "August 2026",

        category: "Generative AI",

        type: "Certification",

        image: genAITools,

        credentialLabel: "CREDENTIAL",

        // No public verification URL has been provided.
        credentialUrl: "",
    },


    // -------------------------------------------------------------
    // Google Foundations of Cybersecurity
    // -------------------------------------------------------------
    {
        id: "google-foundations-cybersecurity",
        title: "Foundations of Cybersecurity",

        issuer: "Google | Coursera",

        date: "January 2024",

        category: "Cybersecurity",

        type: "Professional Certificate",

        image: googleFoundationsCybersecurity,

        credentialLabel: "CREDENTIAL",

        // No public verification URL has been provided.
        credentialUrl: "",
    },


    // -------------------------------------------------------------
    // Tata Cybersecurity Analyst
    // -------------------------------------------------------------
    {
        id: "tata-cybersecurity-analyst",
        title: "Cybersecurity Analyst Job Simulation",

        issuer: "Forage | TCS",

        date: "July 2025",

        category: "Cybersecurity",

        type: "Job Simulation",

        image: tataCybersecurityAnalyst,

        credentialLabel: "CREDENTIAL",

        // No public verification URL has been provided.
        credentialUrl: "",
    },


    // -------------------------------------------------------------
    // TCS iON Career Edge — Generative AI Essentials
    // -------------------------------------------------------------
    {
        id: "tcsion-generative-ai-essentials",
        title: "Generative AI Essentials",

        issuer: "TCS iON",

        date: "September 2026",

        category: "Generative AI",

        type: "Certification",

        image: tcsionGenerativeAI,

        credentialLabel: "CREDENTIAL",

        // No public verification URL has been provided.
        credentialUrl: "",
    },
];


// ---------------------------------------------------------------
// DEFAULT EXPORT
// ---------------------------------------------------------------
// Desktop and mobile Certifications components can import this
// same dataset to keep both interfaces synchronized.
// ---------------------------------------------------------------

export default certifications;
