import { useEffect, useState } from "react";

export const navigationItems = [
    { label: "Home", id: "top", href: "#top" },
    { label: "About", id: "about", href: "#about" },
    { label: "Skills", id: "skills", href: "#skills" },
    { label: "Projects", id: "projects", href: "#projects" },
    { label: "Experience", id: "experience", href: "#experience" },
    { label: "Certifications", id: "certifications", href: "#certifications" },
    { label: "Contact", id: "contact", href: "#contact" },
];

const isNavigationSection = (id) => navigationItems.some((item) => item.id === id);

export const useActiveSection = () => {
    const initialHash = window.location.hash.slice(1);
    const [activeSection, setActiveSection] = useState(
        isNavigationSection(initialHash)
            ? initialHash
            : window.location.hash
                ? ""
                : "top"
    );

    useEffect(() => {
        const sections = navigationItems
            .map(({ id }) => document.getElementById(id))
            .filter(Boolean);

        if (!sections.length || !("IntersectionObserver" in window)) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        intersections.set(entry.target.id, entry);
                    } else {
                        intersections.delete(entry.target.id);
                    }
                });

                const current = [...intersections.values()].sort(
                    (a, b) => b.intersectionRect.height - a.intersectionRect.height
                )[0];

                if (current) {
                    setActiveSection(current.target.id);
                } else if (window.scrollY < 100) {
                    setActiveSection("top");
                }
            },
            {
                rootMargin: "-76px 0px 0px 0px",
                threshold: [0, 0.05, 0.15, 0.3, 0.55, 0.8, 1],
            }
        );
        const intersections = new Map();
        sections.forEach((section) => observer.observe(section));

        const syncFromHistory = () => {
            const id = window.location.hash.slice(1);
            if (isNavigationSection(id)) {
                setActiveSection(id);
            } else if (!id) {
                setActiveSection("top");
            }
        };

        window.addEventListener("popstate", syncFromHistory);
        window.addEventListener("hashchange", syncFromHistory);

        return () => {
            observer?.disconnect();
            window.removeEventListener("popstate", syncFromHistory);
            window.removeEventListener("hashchange", syncFromHistory);
        };
    }, []);

    return [activeSection, setActiveSection];
};

export const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const navigateToSection = (sectionId, offset = 0) => {
    const href = `#${sectionId}`;

    if (window.location.hash !== href) {
        window.history.pushState(null, "", href);
    }

    if (sectionId === "top") {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
        return;
    }

    const target = document.getElementById(sectionId);
    if (!target) {return;}

    const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
    window.scrollTo({
        top: Math.max(0, top),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
};
