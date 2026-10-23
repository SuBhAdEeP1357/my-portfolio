// ================================================================
// PROJECTS DATA
// PORTFOLIO/src/data/projects.js
// ================================================================
//
// Centralized project data for the entire portfolio.
//
// This file is the single source of truth for:
// - Desktop Projects
// - Mobile Projects
// - Project detail modal
// - Project galleries
//
// Project-specific images are imported from:
// src/assets/images/projects/
//
// Architecture diagrams are intentionally omitted where no
// verified architecture asset exists.
//
// ================================================================

// ================================================================
// PROJECT ASSETS — KIBO-AI
// ================================================================

import kiboAICover from "../assets/images/projects/kibo-ai/cover.webp";
import kiboAIScreenshot01 from "../assets/images/projects/kibo-ai/screenshot-01.webp";
import kiboAIScreenshot02 from "../assets/images/projects/kibo-ai/screenshot-02.webp";
import kiboAIScreenshot03 from "../assets/images/projects/kibo-ai/screenshot-03.webp";
import kiboAIScreenshot04 from "../assets/images/projects/kibo-ai/screenshot-04.webp";
import kiboAIScreenshot05 from "../assets/images/projects/kibo-ai/screenshot-05.webp";

// ================================================================
// PROJECT ASSETS — NETWORK SNIFFER
// ================================================================

import networkSnifferCover from "../assets/images/projects/network-sniffer/cover.webp";
import networkSnifferScreenshot01 from "../assets/images/projects/network-sniffer/screenshot-01.webp";
import networkSnifferScreenshot02 from "../assets/images/projects/network-sniffer/screenshot-02.webp";
import networkSnifferScreenshot03 from "../assets/images/projects/network-sniffer/screenshot-03.webp";

// ================================================================
// PROJECT ASSETS — NIDS
// ================================================================

import nidsCover from "../assets/images/projects/nids/cover.webp";
import nidsScreenshot01 from "../assets/images/projects/nids/screenshot-01.webp";
import nidsScreenshot02 from "../assets/images/projects/nids/screenshot-02.webp";
import nidsScreenshot03 from "../assets/images/projects/nids/screenshot-03.webp";

// ================================================================
// PROJECT ASSETS — SECURE CODING REVIEW
// ================================================================

import secureCodingCover from "../assets/images/projects/secure-coding-review/cover.webp";
import secureCodingScreenshot01 from "../assets/images/projects/secure-coding-review/screenshot-01.webp";
import secureCodingScreenshot02 from "../assets/images/projects/secure-coding-review/screenshot-02.webp";

// ================================================================
// PROJECT ASSETS — ARITHMETIC CALCULATOR
// ================================================================

import arithmeticCover from "../assets/images/projects/arithmetic-calculator/cover.webp";
import arithmeticScreenshot01 from "../assets/images/projects/arithmetic-calculator/screenshot-01.webp";
import arithmeticScreenshot02 from "../assets/images/projects/arithmetic-calculator/screenshot-02.webp";

// ================================================================
// PROJECTS
// ================================================================

const projects = [
    // --------------------------------------------------------------
    // KIBO-AI
    // --------------------------------------------------------------

    {
        id: "kibo-ai",
        title: "KIBO AI",
        category: "AI",
        year: "2026",
        status: "IN DEVELOPMENT",

        shortDescription:
            "An AI-focused project currently under active development, with the goal of building a practical and personalized intelligent system.",

        description:
            "KIBO AI is a personal AI project currently under active development. The project is being built incrementally with a focus on creating a practical, structured, and useful AI system. Selected development screenshots are presented here to document its progress while the public repository remains unavailable.",

        role: "AI Developer",
        duration: "2026 — Present",

        technologies: [
            "Python",
            "Artificial Intelligence",
            "Machine Learning",
            "Natural Language Processing",
        ],

        features: [
            "AI-focused application development",
            "Structured dataset development",
            "Data cleaning and preprocessing",
            "Natural language processing",
            "Iterative model development",
            "Continuous experimentation and improvement",
        ],

        coverImage: kiboAICover,

        screenshots: [
            kiboAIScreenshot01,
            kiboAIScreenshot02,
            kiboAIScreenshot03,
            kiboAIScreenshot04,
            kiboAIScreenshot05,
        ],

        // No architecture diagram is currently provided.
        architecture: "",

        // Public repository is not currently available.
        githubUrl: "",
        liveUrl: "",

        githubLabel: "COMING SOON",
    },

    // --------------------------------------------------------------
    // NETWORK INTRUSION DETECTION SYSTEM
    // --------------------------------------------------------------

    {
        id: "network-intrusion-detection-system",
        title: "Network Intrusion Detection System",
        category: "NETWORKING / SECURITY",
        year: "2026",
        status: "COMPLETED",

        shortDescription:
            "A Python-based network intrusion detection system built around Suricata, PCAP analysis, custom rules, and EVE JSON processing.",

        description:
            "A security-focused network intrusion detection system designed to analyze network traffic, detect suspicious activity, and process intrusion alerts. The project combines Suricata with PCAP/Npcap-based traffic capture, custom detection rules, EVE JSON analysis, automated testing, and documentation.",

        role: "Cybersecurity Developer",
        duration: "2026",

        technologies: [
            "Python",
            "Suricata",
            "Npcap",
            "PCAP",
            "YAML",
            "pytest",
            "Git",
            "GitHub",
        ],

        features: [
            "Network traffic analysis and intrusion detection",
            "Custom Suricata detection rules",
            "PCAP/Npcap-based packet processing",
            "EVE JSON alert analysis",
            "Automated testing with pytest",
            "Security-focused documentation and project structure",
        ],

        coverImage: nidsCover,

        screenshots: [
            nidsScreenshot01,
            nidsScreenshot02,
            nidsScreenshot03,
        ],

        // No architecture diagram is currently provided.
        architecture: "",

        githubUrl:
            "https://github.com/SuBhAdEeP1357/CodeAlpha_NetworkIntrusionDetectionSystem",

        liveUrl: "",
    },

    // --------------------------------------------------------------
    // BASIC NETWORK SNIFFER
    // --------------------------------------------------------------

    {
        id: "basic-network-sniffer",
        title: "Basic Network Sniffer",
        category: "NETWORKING / SECURITY",
        year: "2026",
        status: "COMPLETED",

        shortDescription:
            "A Python network packet sniffer for capturing, inspecting, filtering, and exporting live network traffic.",

        description:
            "A practical network traffic analysis application built with Python and Scapy. It captures live packets, identifies protocols, provides packet inspection and filtering capabilities, and supports exporting captured data for further analysis.",

        role: "Cybersecurity Developer",
        duration: "2026",

        technologies: [
            "Python",
            "Scapy",
            "Tkinter",
            "PCAP",
            "CSV",
            "JSON",
        ],

        features: [
            "Live network packet capture",
            "Protocol detection and identification",
            "Packet filtering and inspection",
            "Network traffic analysis",
            "PCAP capture support",
            "CSV and JSON data export",
            "Desktop interface using Tkinter",
        ],

        coverImage: networkSnifferCover,

        screenshots: [
            networkSnifferScreenshot01,
            networkSnifferScreenshot02,
            networkSnifferScreenshot03,
        ],

        // No architecture diagram is currently provided.
        architecture: "",

        githubUrl:
            "https://github.com/SuBhAdEeP1357/CodeAlpha_BasicNetworkSniffer",

        liveUrl: "",
    },

    // --------------------------------------------------------------
    // SECURE CODING REVIEW
    // --------------------------------------------------------------

    {
        id: "secure-coding-review",
        title: "Secure Coding Review",
        category: "SECURE DEVELOPMENT",
        year: "2026",
        status: "COMPLETED",

        shortDescription:
            "A Python-focused secure coding review project using static analysis to identify security issues and validate remediation.",

        description:
            "A security-oriented development project focused on reviewing Python code for common security issues through static analysis. The workflow includes identifying findings, applying remediation, and using regression testing to verify that security improvements do not introduce unintended issues.",

        role: "Security Developer",
        duration: "2026",

        technologies: [
            "Python",
            "Bandit",
            "Static Analysis",
        ],

        features: [
            "Python security-focused code review",
            "Static analysis with Bandit",
            "Security finding identification",
            "Remediation of reported issues",
            "Regression testing",
            "Security-oriented development workflow",
        ],

        coverImage: secureCodingCover,

        screenshots: [
            secureCodingScreenshot01,
            secureCodingScreenshot02,
        ],

        architecture: "",

        github: "https://github.com/SuBhAdEeP1357/CodeAlpha_SecureCodingReview",

        liveUrl: "",
    },

    // --------------------------------------------------------------
    // ARITHMETIC CALCULATOR
    // --------------------------------------------------------------

    {
        id: "arithmetic-calculator",
        title: "Arithmetic Calculator",
        category: "SOFTWARE DEVELOPMENT",
        year: "2026",
        status: "COMPLETED",

        shortDescription:
            "A modular menu-driven calculator written in C with arithmetic, mathematical, and utility operations.",

        description:
            "A menu-driven command-line calculator developed in C using modular programming principles. The project implements common arithmetic and mathematical operations while keeping functionality organized into separate modules for maintainability.",

        role: "C Developer",
        duration: "2026",

        technologies: [
            "C",
            "GCC",
            "Modular Programming",
            "Git",
            "GitHub",
        ],

        features: [
            "Addition",
            "Subtraction",
            "Multiplication",
            "Division",
            "Modulus",
            "Power",
            "Square Root",
            "Percentage",
            "Menu-driven interface",
            "Modular program structure",
        ],

        coverImage: arithmeticCover,

        screenshots: [
            arithmeticScreenshot01,
            arithmeticScreenshot02,
        ],

        architecture: "",

        githubUrl:
            "https://github.com/SuBhAdEeP1357/Arithmetic-Calculator",

        liveUrl: "",
    },
];

// ================================================================
// EXPORT
// ================================================================

export default projects;
