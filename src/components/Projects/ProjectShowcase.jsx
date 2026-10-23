import { useCallback, useEffect, useRef, useState } from "react";
import { FiGithub } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ProjectDetailModal from "./ProjectDetailModal";
import ProjectsAllModal from "./ProjectsAllModal";
import projects from "../../data/projects";
import "./ProjectShowcase.css";

gsap.registerPlugin(ScrollTrigger);

const getTechnologyLabel = (technology) => {
    if (typeof technology === "string") {
        return technology;
    }

    return technology?.name || technology?.label || "";
};

const isExternalUrl = (url) =>
    typeof url === "string" && /^https?:\/\//i.test(url);

const focusLauncher = (element) => {
    if (element instanceof HTMLElement && element.isConnected) {
        element.focus({ preventScroll: true });
    }
};

function ProjectCard({ project, priority = false, onOpen }) {
    const title = project?.title || project?.name || "Project";
    const image = project?.coverImage || project?.cover || "";
    const category = project?.category || project?.type || "PROJECT";
    const description =
        project?.shortDescription || project?.description || "";
    const status = project?.status || "PROJECT";
    const githubUrl = isExternalUrl(project?.githubUrl)
        ? project.githubUrl
        : isExternalUrl(project?.github)
            ? project.github
            : "";
    const technologies = Array.isArray(project?.technologies)
        ? project.technologies
            .map(getTechnologyLabel)
            .filter(Boolean)
        : [];
    const isInDevelopment = status.toUpperCase().includes("DEVELOPMENT");
    const handleOpen = (event) =>
        onOpen(project, event.currentTarget);

    return (
        <article
            className="project-showcase__card"
            data-project-card
        >
            <button
                type="button"
                className="project-showcase__media-button"
                onClick={handleOpen}
                aria-label={"View details for " + title}
            >
                <span className="project-showcase__media">
                    {image ? (
                        <img
                            className="project-showcase__image"
                            src={image}
                            alt={title + " project preview"}
                            loading={priority ? "eager" : "lazy"}
                            fetchPriority={priority ? "high" : "auto"}
                            decoding="async"
                        />
                    ) : (
                        <span
                            className="project-showcase__image-fallback"
                            aria-hidden="true"
                        >
                            {title}
                        </span>
                    )}
                </span>
            </button>

            <div className="project-showcase__content" data-project-reveal>
                <div className="project-showcase__meta">
                    <span className="project-showcase__category">
                        {category}
                    </span>
                    {project?.year && (
                        <span className="project-showcase__year">
                            {project.year}
                        </span>
                    )}
                </div>

                <h3 className="project-showcase__project-title">
                    {title}
                </h3>

                {description && (
                    <p className="project-showcase__description">
                        {description}
                    </p>
                )}

                {technologies.length > 0 && (
                    <ul
                        className="project-showcase__technologies"
                        aria-label={title + " technologies"}
                    >
                        {technologies.map((technology, index) => (
                            <li
                                className="project-showcase__technology"
                                key={project?.id + "-" + technology + "-" + index}
                            >
                                {technology}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="project-showcase__actions">
                    <span
                        className={
                            isInDevelopment
                                ? "project-showcase__status project-showcase__status--active"
                                : "project-showcase__status"
                        }
                    >
                        {status}
                    </span>

                    <div className="project-showcase__action-links">
                        {isInDevelopment ? (
                            <button
                                type="button"
                                className="project-showcase__action project-showcase__coming-soon"
                                disabled
                                aria-label={title + " is in development"}
                            >
                                COMING SOON
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="project-showcase__action portfolio-button portfolio-button--secondary"
                                    onClick={handleOpen}
                                >
                                    VIEW DETAILS
                                </button>

                                {githubUrl && (
                                    <a
                                        className="project-showcase__action portfolio-button portfolio-button--primary"
                                        href={githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={"View " + title + " source code on GitHub"}
                                    >
                                        <FiGithub aria-hidden="true" />
                                        <span>VIEW CODE</span>
                                    </a>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function ProjectShowcase({ portrait = false }) {
    const sectionRef = useRef(null);
    const detailLauncherRef = useRef(null);
    const focusRestoreFrameRef = useRef(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [detailOrigin, setDetailOrigin] = useState("main");
    const projectList = Array.isArray(projects) ? projects : [];
    const featuredProjects = projectList.slice(0, 4);

    const handleOpenProject = useCallback((project, launcher) => {
        if (!project) {
            return;
        }

        if (focusRestoreFrameRef.current !== null) {
            window.cancelAnimationFrame(focusRestoreFrameRef.current);
            focusRestoreFrameRef.current = null;
        }

        detailLauncherRef.current = launcher || document.activeElement;
        setDetailOrigin("main");
        setSelectedProject(project);
        setIsModalOpen(true);
    }, []);

    const handleCloseProject = useCallback(() => {
        setIsModalOpen(false);
        setDetailOrigin("main");

        if (focusRestoreFrameRef.current !== null) {
            window.cancelAnimationFrame(focusRestoreFrameRef.current);
        }

        const launcher = detailLauncherRef.current;
        focusRestoreFrameRef.current = window.requestAnimationFrame(() => {
            focusLauncher(launcher);
            focusRestoreFrameRef.current = null;
        });
    }, []);

    const handleSelectArchiveProject = useCallback((project, launcher) => {
        if (!project) {
            return;
        }

        if (focusRestoreFrameRef.current !== null) {
            window.cancelAnimationFrame(focusRestoreFrameRef.current);
            focusRestoreFrameRef.current = null;
        }

        detailLauncherRef.current = launcher || document.activeElement;
        setDetailOrigin("archive");
        setSelectedProject(project);
        setIsModalOpen(true);
    }, []);

    const handleCloseArchive = useCallback(() => {
        if (isModalOpen) {
            return;
        }

        setIsArchiveOpen(false);
        setDetailOrigin("main");
    }, [isModalOpen]);

    useEffect(() => {
        if (!isModalOpen && !isArchiveOpen) {
            return undefined;
        }

        const handleEscape = (event) => {
            if (event.key !== "Escape") {
                return;
            }

            event.preventDefault();

            if (isModalOpen) {
                handleCloseProject();
            } else {
                handleCloseArchive();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [handleCloseArchive, handleCloseProject, isArchiveOpen, isModalOpen]);

    useEffect(() => {
        if (isModalOpen) {
            return undefined;
        }

        const timeout = window.setTimeout(() => {
            setSelectedProject(null);
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [isModalOpen]);

    useEffect(() => () => {
        if (focusRestoreFrameRef.current !== null) {
            window.cancelAnimationFrame(focusRestoreFrameRef.current);
        }
    }, []);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return undefined;
        }

        const context = gsap.context(() => {
            gsap.utils.toArray("[data-project-reveal]", section).forEach((item) => {
                gsap.fromTo(
                    item,
                    { y: 18 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.65,
                        ease: "power2.out",
                        clearProps: "transform",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 92%",
                            once: true,
                        },
                    }
                );
            });
        }, section);

        return () => context.revert();
    }, [projectList.length]);

    useEffect(() => {
        const timeout = window.setTimeout(() => ScrollTrigger.refresh(), 100);
        return () => window.clearTimeout(timeout);
    }, [projectList.length]);

    return (
        <>
            <section
                ref={sectionRef}
                id="projects"
                className={
                    portrait
                        ? "project-showcase project-showcase--portrait"
                        : "project-showcase"
                }
                aria-labelledby="projects-title"
            >
                <div className="project-showcase__inner">
                    <header className="project-showcase__header" data-project-reveal>
                        <div className="project-showcase__heading-row">
                            <h2 id="projects-title" className="project-showcase__title">
                                PROJECTS
                            </h2>
                            <button
                                type="button"
                                className="project-showcase__view-all portfolio-button portfolio-button--secondary"
                                onClick={() => setIsArchiveOpen(true)}
                                aria-haspopup="dialog"
                                aria-controls="projects-all-modal"
                                aria-expanded={isArchiveOpen}
                            >
                                VIEW ALL
                            </button>
                        </div>
                        <p className="project-showcase__intro">
                            A selection of practical projects built across software
                            development, AI, networking, and cybersecurity.
                        </p>
                    </header>

                    <div className="project-showcase__grid">
                        {featuredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id || project.title}
                                project={project}
                                priority={index === 0}
                                onOpen={handleOpenProject}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <ProjectsAllModal
                projects={projectList}
                isOpen={isArchiveOpen}
                isActive={isArchiveOpen && !isModalOpen}
                disableEscape
                onClose={handleCloseArchive}
                onSelectProject={handleSelectArchiveProject}
            />

            <ProjectDetailModal
                project={selectedProject}
                isOpen={isModalOpen}
                disableEscape
                onClose={handleCloseProject}
                origin={detailOrigin}
                focusReturnTarget={detailLauncherRef.current}
            />
        </>
    );
}
