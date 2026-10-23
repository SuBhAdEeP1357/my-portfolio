// ============================================================
// PROJECT DETAIL MODAL
// src/components/Projects/ProjectDetailModal.jsx
// ============================================================

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
    FiChevronLeft,
    FiChevronRight,
    FiGithub,
    FiX,
} from "react-icons/fi";


// ============================================================
// HELPERS
// ============================================================

const getProjectValue = (project, keys, fallback = "") => {
    if (!project) {return fallback;}

    for (const key of keys) {
        const value = project[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            (!Array.isArray(value) || value.length > 0)
        ) {
            return value;
        }
    }

    return fallback;
};

const getProjectArray = (project, keys) => {
    if (!project) {return [];}

    for (const key of keys) {
        const value = project[key];

        if (Array.isArray(value) && value.length > 0) {
            return value;
        }
    }

    return [];
};

const getExternalUrl = (project, keys) => {
    const value = getProjectValue(project, keys, "");
    return typeof value === "string" && /^https?:\/\//i.test(value)
        ? value
        : "";
};

// ============================================================
// COMPONENT
// ============================================================

const ProjectDetailModal = ({
    project,
    isOpen,
    onClose,
    origin = "main",
    focusReturnTarget = null,
    disableEscape = false,
}) => {
    // ----------------------------------------------------------
    // REFS
    // ----------------------------------------------------------

    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    const panelRef = useRef(null);
    const contentRef = useRef(null);
    const closeButtonRef = useRef(null);
    const previousActiveElementRef = useRef(null);
    const animationRef = useRef(null);
    const [activeVisualIndex, setActiveVisualIndex] = useState(0);

    // ----------------------------------------------------------
    // NORMALIZED PROJECT DATA
    // ----------------------------------------------------------

    const title = getProjectValue(
        project,
        ["title", "name"],
        "Project"
    );

    const category = getProjectValue(
        project,
        ["category", "type"],
        "PROJECT"
    );

    const year = getProjectValue(
        project,
        ["year", "date"],
        ""
    );

    const status = getProjectValue(
        project,
        ["status"],
        ""
    );

    const shortDescription = getProjectValue(
        project,
        ["shortDescription", "subtitle", "tagline", "description"],
        ""
    );

    const description = getProjectValue(
        project,
        ["longDescription", "overview", "details", "description"],
        shortDescription
    );

    const coverImage = getProjectValue(
        project,
        ["cover", "coverImage", "image", "thumbnail"],
        ""
    );

    const githubUrl = getExternalUrl(project, [
        "github",
        "githubUrl",
        "repository",
        "repo",
    ]);

    const liveUrl = getExternalUrl(project, [
        "live",
        "liveUrl",
        "demo",
        "demoUrl",
        "website",
    ]);

    const technologies = getProjectArray(
        project,
        ["technologies", "tech", "stack"]
    );

    const screenshots = getProjectArray(
        project,
        ["screenshots", "gallery", "images"]
    );

    const role = getProjectValue(
        project,
        ["role"],
        ""
    );

    const duration = getProjectValue(
        project,
        ["duration"],
        ""
    );

    // ----------------------------------------------------------
    // BUILD MEDIA LIST
    // ----------------------------------------------------------

    const galleryImages = screenshots
        .map((item) => {
            if (typeof item === "string") {
                return {
                    src: item,
                    alt: `${title} project screenshot`,
                };
            }

            if (item && typeof item === "object") {
                return {
                    src: item.src || item.image || item.url || "",
                    alt:
                        item.alt ||
                        item.title ||
                        `${title} project screenshot`,
                    label: item.label || item.caption || "",
                };
            }

            return null;
        })
        .filter((item) => item?.src);

    const visualImages = [
        ...(coverImage
            ? [{ src: coverImage, alt: `${title} project preview`, label: "PROJECT PREVIEW" }]
            : []),
        ...galleryImages,
    ];

    const activeVisual = visualImages[activeVisualIndex] || visualImages[0];
    const comingSoonLabel = !githubUrl
        ? getProjectValue(project, ["githubLabel"], "")
        : "";

    useEffect(() => {
        setActiveVisualIndex(0);
    }, [project?.id, title]);

    // ----------------------------------------------------------
    // REDUCED MOTION
    // ----------------------------------------------------------

    const prefersReducedMotion = () => {
        if (typeof window === "undefined") {return false;}

        return window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
    };

    // ----------------------------------------------------------
    // LOCK / UNLOCK BODY SCROLL
    // ----------------------------------------------------------

    useLayoutEffect(() => {
        if (!isOpen) {return undefined;}

        const body = document.body;
        const previousOverflow = body.style.overflow;
        const previousPaddingRight = body.style.paddingRight;
        const previousOverscrollBehavior = body.style.overscrollBehavior;
        const scrollPosition = window.scrollY;
        const scrollbarWidth = Math.max(
            0,
            window.innerWidth - document.documentElement.clientWidth
        );
        const computedPaddingRight = Number.parseFloat(
            window.getComputedStyle(body).paddingRight
        ) || 0;

        body.style.overflow = "hidden";
        body.style.overscrollBehavior = "none";
        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
        }

        return () => {
            body.style.overflow = previousOverflow;
            body.style.paddingRight = previousPaddingRight;
            body.style.overscrollBehavior = previousOverscrollBehavior;

            if (Math.abs(window.scrollY - scrollPosition) > 1) {
                window.scrollTo({ top: scrollPosition, behavior: "instant" });
            }
        };
    }, [isOpen]);

    // ----------------------------------------------------------
    // KEYBOARD HANDLING
    // ----------------------------------------------------------

    useEffect(() => {
        if (!isOpen) {return undefined;}

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                if (disableEscape) {
                    return;
                }

                event.preventDefault();
                onClose?.();
                return;
            }

            // Basic focus trap.
            if (event.key !== "Tab") {return;}

            const modal = modalRef.current;

            if (!modal) {return;}

            const focusableElements = modal.querySelectorAll(
                [
                    "a[href]",
                    "button:not([disabled])",
                    "input:not([disabled])",
                    "textarea:not([disabled])",
                    "select:not([disabled])",
                    "[tabindex]:not([tabindex='-1'])",
                ].join(",")
            );

            if (!focusableElements.length) {return;}

            const firstElement = focusableElements[0];
            const lastElement =
                focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [disableEscape, isOpen, onClose]);

    // ----------------------------------------------------------
    // OPEN / CLOSE ANIMATION
    // ----------------------------------------------------------

    useEffect(() => {
        const modal = modalRef.current;
        const backdrop = backdropRef.current;
        const panel = panelRef.current;
        const content = contentRef.current;

        if (!modal || !backdrop || !panel) {
            return undefined;
        }

        const reducedMotion = prefersReducedMotion();

        if (animationRef.current) {
            animationRef.current.kill();
        }

        if (!isOpen) {
            if (reducedMotion) {
                gsap.set(modal, {
                    display: "none",
                    autoAlpha: 0,
                });
                gsap.set(backdrop, { opacity: 0 });
                gsap.set(panel, { opacity: 0, y: 0, scale: 1 });
                gsap.set(content, { opacity: 0, y: 0 });
                return undefined;
            }

            const closeTimeline = gsap.timeline({
                onComplete: () => {
                    gsap.set(modal, {
                        display: "none",
                        autoAlpha: 0,
                    });
                },
            });

            closeTimeline
                .to(content, {
                    opacity: 0,
                    y: -6,
                    duration: 0.14,
                    ease: "power2.in",
                }, 0)
                .to(panel, {
                    opacity: 0,
                    y: 12,
                    scale: 0.99,
                    duration: 0.22,
                    ease: "power3.in",
                }, 0.02)
                .to(backdrop, {
                    opacity: 0,
                    duration: 0.2,
                    ease: "power2.inOut",
                }, 0);

            animationRef.current = closeTimeline;
            return () => closeTimeline.kill();
        }

        previousActiveElementRef.current =
            focusReturnTarget?.isConnected
                ? focusReturnTarget
                : document.activeElement;
        const focusFrame = window.requestAnimationFrame(() => {
            closeButtonRef.current?.focus();
        });

        gsap.set(modal, {
            display: "flex",
            visibility: "visible",
        });

        if (reducedMotion) {
            gsap.set(modal, {
                opacity: 1,
            });

            gsap.set(backdrop, {
                opacity: 1,
            });

            gsap.set(panel, {
                opacity: 1,
                y: 0,
                scale: 1,
            });

            gsap.set(content, {
                opacity: 1,
                y: 0,
            });

            return () => window.cancelAnimationFrame(focusFrame);
        }

        gsap.set(modal, {
            opacity: 0,
        });

        gsap.set(backdrop, {
            opacity: 0,
        });

        gsap.set(panel, {
            opacity: 0,
            y: 16,
            scale: 0.985,
        });

        gsap.set(content, {
            opacity: 0,
            y: 8,
        });

        const timeline = gsap.timeline({
            defaults: {
                ease: "power3.out",
            },
        });

        timeline
            .to(
                modal,
                {
                    opacity: 1,
                    duration: 0.2,
                },
                0
            )
            .to(
                backdrop,
                {
                    opacity: 1,
                    duration: 0.22,
                },
                0
            )
            .to(
                panel,
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.32,
                    ease: "power3.out",
                },
                0.05
            )
            .to(
                content,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.22,
                    ease: "power3.out",
                },
                0.3
            );

        animationRef.current = timeline;

        return () => {
            timeline.kill();
            window.cancelAnimationFrame(focusFrame);
        };
    }, [focusReturnTarget, isOpen]);

    // ----------------------------------------------------------
    // RESTORE FOCUS WHEN CLOSED
    // ----------------------------------------------------------

    useEffect(() => {
        if (isOpen) {return;}

        const returnTarget = focusReturnTarget?.isConnected
            ? focusReturnTarget
            : previousActiveElementRef.current;

        if (returnTarget) {
            try {
                returnTarget.focus({ preventScroll: true });
            } catch {
                // Ignore focus restoration errors.
            }
        }
    }, [focusReturnTarget, isOpen]);

    // ----------------------------------------------------------
    // CLEANUP GSAP
    // ----------------------------------------------------------

    useEffect(() => {
        return () => {
            animationRef.current?.kill();
        };
    }, []);

    // ----------------------------------------------------------
    // BACKDROP CLICK
    // ----------------------------------------------------------

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose?.();
        }
    };

    // ----------------------------------------------------------
    // GALLERY SCROLL
    // ----------------------------------------------------------

    const moveVisual = (direction) => {
        if (visualImages.length < 2) {return;}

        setActiveVisualIndex((currentIndex) =>
            (currentIndex + direction + visualImages.length) % visualImages.length
        );
    };

    // ----------------------------------------------------------
    // RENDER
    // ----------------------------------------------------------

    if (!project) {
        return null;
    }

    return (
        <div
            ref={modalRef}
            className={
                origin === "archive"
                    ? "project-detail-modal project-detail-modal--nested"
                    : "project-detail-modal"
            }
            role="presentation"
            aria-hidden={!isOpen}
            inert={!isOpen}
        >
            {/* =====================================================
          BACKDROP
      ====================================================== */}

            <div
                ref={backdropRef}
                className="project-detail-modal__backdrop"
                onMouseDown={handleBackdropClick}
                aria-hidden="true"
            />

            {/* =====================================================
          PANEL
      ====================================================== */}

            <section
                ref={panelRef}
                className="project-detail-modal__panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-detail-modal-title"
                aria-describedby={
                    shortDescription || description
                        ? "project-detail-modal-description"
                        : undefined
                }
                tabIndex={-1}
            >
                {/* ===================================================
            TOP BAR
        ==================================================== */}

                <div className="project-detail-modal__topbar">
                    <div className="project-detail-modal__topbar-left">
                        <span className="project-detail-modal__eyebrow">
                            PROJECT DETAIL
                        </span>

                        <span className="project-detail-modal__separator">/</span>
                        <span className="project-detail-modal__category">{category}</span>
                    </div>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        className="projects-all-modal__close certificate-modal__detail-close project-detail-modal__close portfolio-button portfolio-button--secondary"
                        onClick={onClose}
                        aria-label="Close project details"
                    >
                        <span className="project-detail-modal__close-label">
                            CLOSE
                        </span>

                        <span className="projects-all-modal__close-icon" aria-hidden="true">
                            <FiX />
                        </span>
                    </button>
                </div>

                <div
                    ref={contentRef}
                    className="project-detail-modal__content"
                >
                    <div className="project-detail-modal__summary">
                        <div className="project-detail-modal__summary-main">
                            <header className="project-detail-modal__hero">
                                <h2 id="project-detail-modal-title" className="project-detail-modal__title">
                                    {title}
                                </h2>
                                {(shortDescription || description) && (
                                    <p id="project-detail-modal-description" className="project-detail-modal__description">
                                        {shortDescription || description}
                                    </p>
                                )}
                            </header>

                            <div className="project-detail-modal__meta" aria-label="Project details">
                                {year && (
                                    <div className="project-detail-modal__meta-item">
                                        <span>YEAR</span><strong>{year}</strong>
                                    </div>
                                )}
                                {role && (
                                    <div className="project-detail-modal__meta-item">
                                        <span>ROLE</span><strong>{role}</strong>
                                    </div>
                                )}
                                {duration && (
                                    <div className="project-detail-modal__meta-item">
                                        <span>DURATION</span><strong>{duration}</strong>
                                    </div>
                                )}
                            </div>

                            {technologies.length > 0 && (
                                <div className="project-detail-modal__technology-list" aria-label="Technologies">
                                    {technologies.map((technology, index) => {
                                        const label = typeof technology === "string"
                                            ? technology
                                            : technology?.name || technology?.label || "";

                                        if (!label) {return null;}

                                        return (
                                            <span key={`${label}-${index}`} className="project-detail-modal__technology">
                                                {label}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {(status || githubUrl || liveUrl || comingSoonLabel) && (
                            <div className="project-detail-modal__summary-footer">
                                {status && (
                                    <div className="project-detail-modal__meta-item project-detail-modal__status" aria-label="Project status">
                                        <span>STATUS</span><strong>{status}</strong>
                                    </div>
                                )}

                                {(githubUrl || liveUrl || comingSoonLabel) && (
                                    <div className="project-detail-modal__actions" aria-label="Project links">
                                        {githubUrl && (
                                            <a
                                                className="project-detail-modal__action project-detail-modal__action--primary portfolio-button portfolio-button--primary"
                                                href={githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FiGithub aria-hidden="true" />
                                                <span>VIEW ON GITHUB</span>
                                            </a>
                                        )}
                                        {liveUrl && (
                                            <a
                                                className="project-detail-modal__action portfolio-button portfolio-button--secondary"
                                                href={liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <span>OPEN DEMO</span>
                                            </a>
                                        )}
                                        {comingSoonLabel && (
                                            <span className="project-detail-modal__action project-detail-modal__action--coming-soon" aria-disabled="true">
                                                {comingSoonLabel}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <figure className="project-detail-modal__visual">
                        <div className="project-detail-modal__visual-frame">
                            {activeVisual && (
                                <img
                                    key={activeVisual.src}
                                    src={activeVisual.src}
                                    alt={activeVisual.alt}
                                    className="project-detail-modal__visual-image"
                                    decoding="async"
                                    loading={activeVisualIndex === 0 ? "eager" : "lazy"}
                                />
                            )}
                        </div>
                        {visualImages.length > 1 && (
                            <figcaption className="project-detail-modal__visual-controls">
                                <button
                                    type="button"
                                    onClick={() => moveVisual(-1)}
                                    aria-label="Previous project visual"
                                >
                                    <FiChevronLeft aria-hidden="true" />
                                </button>
                                <span aria-live="polite">
                                    PROJECT VISUAL {String(activeVisualIndex + 1).padStart(2, "0")} / {String(visualImages.length).padStart(2, "0")}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => moveVisual(1)}
                                    aria-label="Next project visual"
                                >
                                    <FiChevronRight aria-hidden="true" />
                                </button>
                            </figcaption>
                        )}
                    </figure>

                </div>
            </section>
        </div>
    );
};

export default ProjectDetailModal;
