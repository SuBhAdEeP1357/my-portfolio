import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
    FiGithub,
    FiLayers,
    FiX,
} from "react-icons/fi";


/**
 * ProjectsAllModal
 *
 * Responsibilities:
 * - Displays the complete project collection.
 * - Provides a compact project-browser experience.
 * - Supports keyboard navigation and Escape-to-close.
 * - Locks background scrolling while open.
 * - Respects prefers-reduced-motion.
 * - Does NOT own project-detail content.
 * - Passes the selected project back to the parent.
 *
 * Expected props:
 *
 * projects       -> Array of project objects
 * isOpen         -> Boolean
 * onClose        -> Function
 * onSelectProject -> Function(project)
 */

const getProjectValue = (project, keys, fallback = "") => {
    if (!project || typeof project !== "object") {
        return fallback;
    }

    for (const key of keys) {
        const value = project[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return fallback;
};

const getProjectArray = (project, keys) => {
    const value = getProjectValue(project, keys, []);

    return Array.isArray(value) ? value : [];
};

const getProjectImage = (project) =>
    getProjectValue(
        project,
        ["cover", "coverImage", "image", "thumbnail"],
        ""
    );

const getProjectGithub = (project) =>
    getProjectValue(
        project,
        ["github", "githubUrl", "repository", "repo"],
        ""
    );

const getProjectLive = (project) =>
    getProjectValue(
        project,
        ["live", "liveUrl", "demo", "demoUrl"],
        ""
    );

const getProjectTechnologies = (project) =>
    getProjectArray(project, [
        "technologies",
        "tech",
        "stack",
    ]);

const getTechnologyLabel = (technology) =>
    typeof technology === "string"
        ? technology
        : getProjectValue(technology, ["name", "label"], "");

const getProjectStatus = (project) =>
    getProjectValue(
        project,
        ["status", "state"],
        "PROJECT"
    );

const getProjectCategory = (project) =>
    getProjectValue(
        project,
        ["category", "type"],
        "SOFTWARE"
    );

const getProjectYear = (project) =>
    getProjectValue(
        project,
        ["year", "date"],
        ""
    );

const getProjectDescription = (project) =>
    getProjectValue(
        project,
        ["shortDescription", "description", "summary"],
        ""
    );

const getProjectTitle = (project) =>
    getProjectValue(
        project,
        ["title", "name"],
        "Untitled Project"
    );

const isExternalUrl = (url) =>
    typeof url === "string" &&
    /^(https?:\/\/|mailto:|tel:)/i.test(url);

function ProjectsAllModal({
    projects = [],
    isOpen = false,
    isActive = isOpen,
    disableEscape = false,
    onClose,
    onSelectProject,
}) {
    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    const panelRef = useRef(null);
    const contentRef = useRef(null);
    const closeButtonRef = useRef(null);
    const previousFocusedElementRef = useRef(null);

    const projectList = Array.isArray(projects)
        ? projects.filter(Boolean)
        : [];

    /* =======================================================
       REDUCED MOTION
       ======================================================= */

    const prefersReducedMotion = () => {
        if (typeof window === "undefined") {
            return false;
        }

        return window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
    };

    /* =======================================================
       CLOSE HANDLER
       ======================================================= */

    const handleClose = useCallback(() => {
        if (typeof onClose === "function") {
            onClose();
        }
    }, [onClose]);

    /* =======================================================
       PROJECT SELECTION
       ======================================================= */

    const handleProjectSelect = useCallback(
        (project, launcher) => {
            if (!project) {
                return;
            }

            if (typeof onSelectProject === "function") {
                onSelectProject(project, launcher);
            }
        },
        [onSelectProject]
    );

    /* =======================================================
       BODY SCROLL LOCK
       ======================================================= */

    useEffect(() => {
        if (!isOpen) {
            document.body.classList.remove(
                "projects-all-modal-open"
            );

            return undefined;
        }

        document.body.classList.add(
            "projects-all-modal-open"
        );

        return () => {
            document.body.classList.remove(
                "projects-all-modal-open"
            );
        };
    }, [isOpen]);

    /* =======================================================
       FOCUS MANAGEMENT
       ======================================================= */

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        previousFocusedElementRef.current =
            document.activeElement;

        const focusTimer = window.setTimeout(() => {
            closeButtonRef.current?.focus();
        }, prefersReducedMotion() ? 0 : 100);

        return () => {
            window.clearTimeout(focusTimer);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            return undefined;
        }

        const previousElement =
            previousFocusedElementRef.current;

        if (
            previousElement &&
            typeof previousElement.focus === "function"
        ) {
            const restoreTimer = window.setTimeout(() => {
                try {
                    previousElement.focus();
                } catch {
                    // Ignore focus restoration errors.
                }
            }, 0);

            return () => {
                window.clearTimeout(restoreTimer);
            };
        }

        return undefined;
    }, [isOpen]);

    /* =======================================================
       KEYBOARD HANDLING
       ======================================================= */

    useEffect(() => {
        if (!isOpen || !isActive) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                if (disableEscape) {
                    return;
                }

                event.preventDefault();
                handleClose();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const modal = modalRef.current;

            if (!modal) {
                return;
            }

            const focusableElements = Array.from(
                modal.querySelectorAll(
                    [
                        "a[href]",
                        "button:not([disabled])",
                        "input:not([disabled])",
                        "textarea:not([disabled])",
                        "select:not([disabled])",
                        "[tabindex]:not([tabindex='-1'])",
                    ].join(",")
                )
            ).filter(
                (element) =>
                    element.offsetParent !== null &&
                    !element.hasAttribute("aria-hidden")
            );

            if (!focusableElements.length) {
                event.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement =
                focusableElements[
                focusableElements.length - 1
                ];

            if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
                return;
            }

            if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [disableEscape, handleClose, isActive, isOpen]);

    /* =======================================================
       GSAP OPEN / CLOSE ANIMATION
       ======================================================= */

    useEffect(() => {
        const modal = modalRef.current;
        const backdrop = backdropRef.current;
        const panel = panelRef.current;
        const content = contentRef.current;

        if (!modal || !backdrop || !panel) {
            return undefined;
        }

        const reducedMotion = prefersReducedMotion();

        if (!isOpen) {
            gsap.killTweensOf([
                modal,
                backdrop,
                panel,
                content,
            ]);

            if (reducedMotion) {
                gsap.set(modal, {
                    autoAlpha: 0,
                    display: "none",
                });

                gsap.set(backdrop, {
                    opacity: 0,
                });

                gsap.set(panel, {
                    opacity: 0,
                    y: 0,
                    scale: 1,
                });

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
                .to(
                    content,
                    {
                        opacity: 0,
                        y: -6,
                        duration: 0.14,
                        ease: "power2.in",
                    },
                    0
                )
                .to(
                    panel,
                    {
                        opacity: 0,
                        y: 12,
                        scale: 0.99,
                        duration: 0.22,
                        ease: "power3.in",
                    },
                    0.04
                )
                .to(
                    backdrop,
                    {
                        opacity: 0,
                        duration: 0.2,
                        ease: "power2.inOut",
                    },
                    0
                );

            return () => {
                closeTimeline.kill();
            };
        }

        gsap.killTweensOf([
            modal,
            backdrop,
            panel,
            content,
        ]);

        gsap.set(modal, {
            display: "flex",
            autoAlpha: 1,
        });

        if (reducedMotion) {
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

            return undefined;
        }

        gsap.set(backdrop, {
            opacity: 0,
        });

        gsap.set(panel, {
            opacity: 0,
            y: 16,
            scale: 0.99,
        });

        gsap.set(content, {
            opacity: 0,
            y: 7,
        });

        const openTimeline = gsap.timeline();

        openTimeline
            .to(
                backdrop,
                {
                    opacity: 1,
                    duration: 0.22,
                    ease: "power2.out",
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
                0.04
            )
            .to(
                content,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.2,
                    ease: "power2.out",
                },
                0.2
            );

        return () => {
            openTimeline.kill();
        };
    }, [isOpen]);

    /* =======================================================
       SCROLL RESET ON OPEN
       ======================================================= */

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const content = contentRef.current;

        if (content) {
            content.scrollTop = 0;
        }
    }, [isOpen]);

    /* =======================================================
       BACKDROP CLICK
       ======================================================= */

    const handleBackdropClick = (event) => {
        if (
            isActive &&
            event.target === backdropRef.current
        ) {
            handleClose();
        }
    };

    /* =======================================================
       RENDER
       ======================================================= */

    if (!isOpen) {
        return null;
    }

    return (
        <div
            ref={modalRef}
            id="projects-all-modal"
            className="projects-all-modal"
            role="dialog"
            aria-modal="true"
            aria-hidden={!isActive}
            inert={!isActive}
            aria-labelledby="projects-all-modal-title"
            aria-describedby="projects-all-modal-description"
        >
            {/* =================================================
          BACKDROP
          ================================================= */}

            <div
                ref={backdropRef}
                className="projects-all-modal__backdrop"
                onMouseDown={handleBackdropClick}
                aria-hidden="true"
            />

            {/* =================================================
          PANEL
          ================================================= */}

            <section
                ref={panelRef}
                className="projects-all-modal__panel"
            >
                <header className="projects-all-modal__topbar">
                    <div className="projects-all-modal__heading">
                        <h2
                            id="projects-all-modal-title"
                            className="projects-all-modal__title"
                        >
                            ALL PROJECTS
                        </h2>

                        <p
                            id="projects-all-modal-description"
                            className="projects-all-modal__subtitle"
                        >
                            Explore the complete collection of
                            projects across software development,
                            AI, networking, and cybersecurity.
                        </p>
                    </div>

                    <div className="projects-all-modal__topbar-right">
                        <button
                            ref={closeButtonRef}
                            type="button"
                            className="projects-all-modal__close"
                            onClick={handleClose}
                            aria-label="Close all projects"
                        >
                            <span className="projects-all-modal__close-label">
                                CLOSE
                            </span>

                            <span
                                className="projects-all-modal__close-icon"
                                aria-hidden="true"
                            >
                                <FiX />
                            </span>
                        </button>
                    </div>
                </header>

                <div
                    ref={contentRef}
                    className="projects-all-modal__content"
                >
                    {projectList.length > 0 ? (
                        <div className="projects-all-modal__list">
                            {projectList.map(
                                (project, index) => {
                                    const title =
                                        getProjectTitle(project);

                                    const category =
                                        getProjectCategory(project);

                                    const year =
                                        getProjectYear(project);

                                    const status =
                                        getProjectStatus(project);

                                    const description =
                                        getProjectDescription(
                                            project
                                        );

                                    const image =
                                        getProjectImage(project);

                                    const technologies =
                                        getProjectTechnologies(
                                            project
                                        ).map(getTechnologyLabel).filter(Boolean);

                                    const github =
                                        getProjectGithub(project);

                                    const live =
                                        getProjectLive(project);

                                    const isInDevelopment =
                                        status.toUpperCase().includes("DEVELOPMENT");

                                    return (
                                        <article
                                            key={
                                                project.id ||
                                                `${title}-${index}`
                                            }
                                            className="projects-all-modal__item"
                                        >
                                            <button
                                                type="button"
                                                className="projects-all-modal__item-visual-button"
                                                onClick={(event) =>
                                                    handleProjectSelect(
                                                        project,
                                                        event.currentTarget
                                                    )
                                                }
                                                aria-label={`View details for ${title}`}
                                            >
                                                <span className="projects-all-modal__item-visual">
                                                    {image ? (
                                                        <img
                                                            className="projects-all-modal__item-image"
                                                            src={image}
                                                            alt={`${title} project preview`}
                                                            loading={
                                                                index === 0
                                                                    ? "eager"
                                                                    : "lazy"
                                                            }
                                                            decoding="async"
                                                        />
                                                    ) : (
                                                        <span className="projects-all-modal__item-image-fallback">
                                                            Preview unavailable
                                                        </span>
                                                    )}
                                                </span>
                                            </button>

                                            <div className="projects-all-modal__item-content">
                                                <div className="projects-all-modal__item-header">
                                                    <span className="projects-all-modal__item-category">
                                                        {category}
                                                    </span>

                                                    {year && (
                                                        <span className="projects-all-modal__item-year">
                                                            {year}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="projects-all-modal__item-title">
                                                    {title}
                                                </h3>

                                                {description && (
                                                    <p className="projects-all-modal__item-description">
                                                        {description}
                                                    </p>
                                                )}

                                                {technologies.length > 0 && (
                                                    <ul
                                                        className="projects-all-modal__item-technologies"
                                                        aria-label={`${title} technologies`}
                                                    >
                                                        {technologies.map(
                                                            (technology, technologyIndex) => (
                                                                <li
                                                                    key={`${project.id || title}-${technology}-${technologyIndex}`}
                                                                    className="projects-all-modal__item-technology"
                                                                >
                                                                    {technology}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}

                                                <div className="projects-all-modal__item-footer">
                                                    <span
                                                        className={
                                                            isInDevelopment
                                                                ? "projects-all-modal__item-status projects-all-modal__item-status--active"
                                                                : "projects-all-modal__item-status"
                                                        }
                                                    >
                                                        <span
                                                            className="projects-all-modal__item-status-dot"
                                                            aria-hidden="true"
                                                        />
                                                        {status}
                                                    </span>

                                                    <div className="projects-all-modal__item-links">
                                                        {isInDevelopment ? (
                                                            <button
                                                                type="button"
                                                                className="projects-all-modal__item-link projects-all-modal__coming-soon portfolio-button portfolio-button--secondary"
                                                                disabled
                                                                aria-label={`${title} is in development`}
                                                            >
                                                                COMING SOON
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="projects-all-modal__item-link portfolio-button portfolio-button--secondary"
                                                                onClick={(event) => handleProjectSelect(project, event.currentTarget)}
                                                                aria-label={`View details for ${title}`}
                                                            >
                                                                VIEW DETAILS
                                                            </button>
                                                        )}

                                                        {github && isExternalUrl(github) && (
                                                            <a
                                                                className="projects-all-modal__item-link portfolio-button portfolio-button--secondary"
                                                                href={github}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label={`View ${title} source code on GitHub`}
                                                            >
                                                                <FiGithub aria-hidden="true" />
                                                                <span>VIEW CODE</span>
                                                            </a>
                                                        )}

                                                        {live && isExternalUrl(live) && (
                                                            <a
                                                                className="projects-all-modal__item-link portfolio-button portfolio-button--secondary"
                                                                href={live}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label={`View ${title} live project`}
                                                            >
                                                                LIVE PROJECT
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </div>
                    ) : (
                        <div className="projects-all-modal__empty">
                            <FiLayers
                                className="projects-all-modal__empty-icon"
                                aria-hidden="true"
                            />

                            <h3 className="projects-all-modal__empty-title">
                                No projects available.
                            </h3>

                            <p className="projects-all-modal__empty-text">
                                Project data will appear here once
                                the project collection is populated.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default ProjectsAllModal;
