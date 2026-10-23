// ================================================================
// APPLICATION ENTRY POINT
// PORTFOLIO/src/main.jsx
// ================================================================

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./styles/fonts.css";
import "./index.css";
import "./components/Projects/ProjectsAllModal.css";
import "./components/Projects/ProjectDetailModal.css";
import "./reconstruction.css";
import "./button-system.css";
import "./components/Certifications/Certifications.css";
import "./components/Certifications/CertificationsMobile.css";
import "./major-section-headings.css";

// ================================================================
// ROOT
// ================================================================

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error(
        "KIBO Portfolio: Root element #root was not found."
    );
}

// ================================================================
// RENDER APPLICATION
// ================================================================

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
