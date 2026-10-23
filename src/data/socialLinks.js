// ================================================================
// SOCIAL LINKS DATA
// PORTFOLIO/data/socialLinks.js
// ================================================================

import {
    FiGithub,
    FiInstagram,
    FiLinkedin,
    FiMail,
} from "react-icons/fi";

// ================================================================
// SOCIAL LINKS
// ================================================================

const socialLinks = [
    {
        id: "email",
        label: "Email",
        name: "Email",
        contactLabel: "EMAIL",
        value: "iot23.subhadeepadhikary.31@gmail.com",
        url: "mailto:iot23.subhadeepadhikary.31@gmail.com",
        icon: FiMail,
        external: false,
    },

    {
        id: "github",
        label: "GitHub",
        name: "GitHub",
        contactLabel: "GITHUB",
        value: "github.com/SuBhAdEeP1357",
        url: "https://github.com/SuBhAdEeP1357",
        icon: FiGithub,
        external: true,
    },

    {
        id: "linkedin",
        label: "LinkedIn",
        name: "LinkedIn",
        contactLabel: "LINKEDIN",
        value: "linkedin.com/in/subhadeepadhikary",
        url: "https://www.linkedin.com/in/subhadeepadhikary",
        icon: FiLinkedin,
        external: true,
    },

    {
        id: "instagram",
        label: "Instagram",
        name: "Instagram",
        contactLabel: "INSTAGRAM",
        value: "instagram.com/subhadeepadhikaryofficial",
        url: "https://www.instagram.com/subhadeepadhikaryofficial",
        icon: FiInstagram,
        external: true,
    },
];

// ================================================================
// EXPORT
// ================================================================

export default socialLinks;
