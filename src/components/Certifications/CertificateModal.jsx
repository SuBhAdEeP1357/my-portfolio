import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import CertificateCard from "./CertificateCard";
import { getCredentialUrl } from "./certificationUtils";

const EXIT_DURATION = 280;

function focusElement(element) {
    if (element instanceof HTMLElement && element.isConnected) {
        element.focus({ preventScroll: true });
    }
}

function CertificateModal({
    mode,
    detailOrigin,
    certificate,
    certificates = [],
    onClose,
    onViewCertificate,
}) {
    const archivePanelRef = useRef(null);
    const archiveContentRef = useRef(null);
    const archiveCloseButtonRef = useRef(null);
    const detailPanelRef = useRef(null);
    const detailCloseButtonRef = useRef(null);
    const archiveLauncherRef = useRef(null);
    const detailLauncherRef = useRef(null);
    const detailOriginRef = useRef(null);
    const wasArchiveOpenRef = useRef(false);
    const wasDetailOpenRef = useRef(false);
    const archiveExitTimeoutRef = useRef(null);
    const detailExitTimeoutRef = useRef(null);
    const archiveEntryFrameRef = useRef(null);
    const detailEntryFrameRef = useRef(null);

    const [archiveEntered, setArchiveEntered] = useState(false);
    const [detailEntered, setDetailEntered] = useState(false);
    const [isArchiveExiting, setIsArchiveExiting] = useState(false);
    const [exitingDetail, setExitingDetail] = useState(null);

    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isArchiveOpen =
        mode === "archive" ||
        (mode === "preview" && detailOrigin === "archive");
    const isDetailOpen = mode === "preview" && Boolean(certificate);
    const detailIsClosing = !isDetailOpen && Boolean(exitingDetail);
    const displayedCertificate = isDetailOpen
        ? certificate
        : exitingDetail?.certificate;
    const displayedDetailOrigin = isDetailOpen
        ? detailOrigin
        : exitingDetail?.origin;
    const showArchive = isArchiveOpen || isArchiveExiting;
    const showDetail = isDetailOpen || detailIsClosing;
    const isAnyModalVisible = showArchive || showDetail;

    useEffect(() => {
        if (!isArchiveOpen) {
            setArchiveEntered(false);
            return undefined;
        }

        if (prefersReducedMotion) {
            setArchiveEntered(true);
            return undefined;
        }

        archiveEntryFrameRef.current = window.requestAnimationFrame(() => {
            setArchiveEntered(true);
        });

        return () => {
            if (archiveEntryFrameRef.current !== null) {
                window.cancelAnimationFrame(archiveEntryFrameRef.current);
            }
        };
    }, [isArchiveOpen, prefersReducedMotion]);

    useEffect(() => {
        if (!isDetailOpen) {
            setDetailEntered(false);
            return undefined;
        }

        if (detailExitTimeoutRef.current !== null) {
            window.clearTimeout(detailExitTimeoutRef.current);
            detailExitTimeoutRef.current = null;
        }
        setExitingDetail(null);

        if (prefersReducedMotion) {
            setDetailEntered(true);
            return undefined;
        }

        detailEntryFrameRef.current = window.requestAnimationFrame(() => {
            setDetailEntered(true);
        });

        return () => {
            if (detailEntryFrameRef.current !== null) {
                window.cancelAnimationFrame(detailEntryFrameRef.current);
            }
        };
    }, [isDetailOpen, prefersReducedMotion]);

    useLayoutEffect(() => {
        const wasOpen = wasArchiveOpenRef.current;

        if (isArchiveOpen && !wasOpen) {
            archiveLauncherRef.current = document.activeElement;
            setIsArchiveExiting(false);
            archiveCloseButtonRef.current?.focus({ preventScroll: true });
        } else if (!isArchiveOpen && wasOpen) {
            if (archiveExitTimeoutRef.current !== null) {
                window.clearTimeout(archiveExitTimeoutRef.current);
            }

            setArchiveEntered(false);

            if (prefersReducedMotion) {
                setIsArchiveExiting(false);
                window.requestAnimationFrame(() => {
                    focusElement(archiveLauncherRef.current);
                    archiveLauncherRef.current = null;
                });
            } else {
                setIsArchiveExiting(true);
                archiveExitTimeoutRef.current = window.setTimeout(() => {
                    setIsArchiveExiting(false);
                    window.requestAnimationFrame(() => {
                        focusElement(archiveLauncherRef.current);
                        archiveLauncherRef.current = null;
                    });
                }, EXIT_DURATION);
            }
        }

        wasArchiveOpenRef.current = isArchiveOpen;
    }, [isArchiveOpen, prefersReducedMotion]);

    useLayoutEffect(() => {
        const wasOpen = wasDetailOpenRef.current;

        if (isDetailOpen && !wasOpen) {
            detailLauncherRef.current = document.activeElement;
            detailOriginRef.current = detailOrigin;
            detailCloseButtonRef.current?.focus({ preventScroll: true });
        } else if (!isDetailOpen && wasOpen) {
            const returnFocus =
                detailOriginRef.current === "archive"
                    ? detailLauncherRef.current
                    : detailLauncherRef.current;
            focusElement(returnFocus);
            detailLauncherRef.current = null;
            detailOriginRef.current = null;
        }

        wasDetailOpenRef.current = isDetailOpen;
    }, [detailOrigin, isDetailOpen]);

    useLayoutEffect(() => {
        if (!isAnyModalVisible) {
            return undefined;
        }

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
    }, [isAnyModalVisible]);

    useEffect(() => {
        const activePanel = isDetailOpen
            ? detailPanelRef.current
            : isArchiveOpen && !detailIsClosing
                ? archivePanelRef.current
                : null;

        if (!activePanel) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusable = Array.from(
                activePanel.querySelectorAll(
                    "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])"
                )
            ).filter((element) => !element.closest("[inert]"));
            const first = focusable[0];
            const last = focusable.at(-1);
            const focusIsOutside = !activePanel.contains(document.activeElement);

            if (event.shiftKey && (document.activeElement === first || focusIsOutside)) {
                event.preventDefault();
                last?.focus();
            } else if (
                !event.shiftKey &&
                (document.activeElement === last || focusIsOutside)
            ) {
                event.preventDefault();
                first?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [detailIsClosing, isArchiveOpen, isDetailOpen, onClose]);

    useEffect(() => () => {
        if (archiveExitTimeoutRef.current !== null) {
            window.clearTimeout(archiveExitTimeoutRef.current);
        }
        if (detailExitTimeoutRef.current !== null) {
            window.clearTimeout(detailExitTimeoutRef.current);
        }
        if (archiveEntryFrameRef.current !== null) {
            window.cancelAnimationFrame(archiveEntryFrameRef.current);
        }
        if (detailEntryFrameRef.current !== null) {
            window.cancelAnimationFrame(detailEntryFrameRef.current);
        }
    }, []);

    const closeDetail = () => {
        if (!isDetailOpen) {
            return;
        }

        if (detailExitTimeoutRef.current !== null) {
            window.clearTimeout(detailExitTimeoutRef.current);
        }

        if (prefersReducedMotion) {
            onClose();
            return;
        }

        setExitingDetail({
            certificate,
            origin: detailOrigin,
        });
        setDetailEntered(false);
        onClose();
        detailExitTimeoutRef.current = window.setTimeout(() => {
            setExitingDetail(null);
            detailExitTimeoutRef.current = null;
        }, EXIT_DURATION);
    };

    const handleArchiveBackdropMouseDown = (event) => {
        if (event.target === event.currentTarget && isArchiveOpen) {
            onClose();
        }
    };

    const handleDetailBackdropMouseDown = (event) => {
        if (event.target === event.currentTarget && isDetailOpen) {
            closeDetail();
        }
    };

    const credentialUrl = displayedCertificate
        ? getCredentialUrl(displayedCertificate.credentialUrl)
        : "";

    return (
        <>
            {showArchive && (
                <div
                    className={`certificate-modal certificate-modal--archive projects-all-modal${archiveEntered && !isArchiveExiting ? " certificate-modal--open" : ""}${isArchiveExiting ? " certificate-modal--closing" : ""}`}
                    role="presentation"
                    aria-hidden={!isArchiveOpen || isDetailOpen}
                    inert={!isArchiveOpen || isDetailOpen}
                >
                    <div
                        className="projects-all-modal__backdrop"
                        aria-hidden="true"
                        onMouseDown={handleArchiveBackdropMouseDown}
                    />
                    <section
                        ref={archivePanelRef}
                        id="certificate-modal-panel"
                        className="projects-all-modal__panel"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="certificate-archive-title"
                        aria-describedby="certificate-archive-description"
                        tabIndex={-1}
                    >
                        <header className="projects-all-modal__topbar">
                            <div className="projects-all-modal__heading">
                                <h2
                                    id="certificate-archive-title"
                                    className="projects-all-modal__title"
                                >
                                    ALL CERTIFICATES
                                </h2>
                                <p
                                    id="certificate-archive-description"
                                    className="projects-all-modal__subtitle"
                                >
                                    Explore the certifications and credentials earned
                                    through continuous learning.
                                </p>
                            </div>
                            <div className="projects-all-modal__topbar-right">
                                <button
                                    ref={archiveCloseButtonRef}
                                    type="button"
                                    className="projects-all-modal__close"
                                    onClick={onClose}
                                    aria-label="Close all certificates"
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
                            ref={archiveContentRef}
                            className="projects-all-modal__content"
                        >
                            <div className="credential-archive__grid credential-archive__grid--archive">
                                {certificates.map((item, position) => (
                                    <CertificateCard
                                        certificate={item}
                                        position={position}
                                        idPrefix="archive"
                                        onViewCertificate={onViewCertificate}
                                        key={item.id}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {showDetail && displayedCertificate && (
                <div
                    className={`certificate-modal certificate-modal--detail${displayedDetailOrigin === "archive" ? " certificate-modal--nested-detail" : ""}${detailEntered && !detailIsClosing ? " certificate-modal--open" : ""}${detailIsClosing ? " certificate-modal--closing" : ""}`}
                    role="presentation"
                    aria-hidden={detailIsClosing}
                    inert={detailIsClosing}
                >
                    <div
                        className="certificate-modal__backdrop"
                        aria-hidden="true"
                        onMouseDown={handleDetailBackdropMouseDown}
                    />
                    <section
                        ref={detailPanelRef}
                        id="certificate-detail-panel"
                        className="certificate-modal__panel"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="certificate-detail-title"
                        tabIndex={-1}
                    >
                        <header className="certificate-modal__detail-header">
                            <div className="certificate-modal__detail-heading">
                                <span className="certificate-modal__eyebrow">
                                    CERTIFICATE PREVIEW
                                </span>
                                <h2 id="certificate-detail-title">
                                    {displayedCertificate.title}
                                </h2>
                            </div>
                            <button
                                ref={detailCloseButtonRef}
                                type="button"
                                className="projects-all-modal__close certificate-modal__detail-close"
                                onClick={closeDetail}
                                aria-label="Close certificate preview"
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
                        </header>
                        <div className="certificate-modal__detail-content">
                            {displayedCertificate.image && (
                                <figure className="certificate-modal__image-frame">
                                    <img
                                        src={displayedCertificate.image}
                                        alt={`${displayedCertificate.title} certificate issued by ${displayedCertificate.issuer}`}
                                        decoding="async"
                                    />
                                </figure>
                            )}
                            <dl className="certificate-modal__meta">
                                <div>
                                    <dt>ISSUER</dt>
                                    <dd>{displayedCertificate.issuer}</dd>
                                </div>
                                <div>
                                    <dt>DATE</dt>
                                    <dd>{displayedCertificate.date}</dd>
                                </div>
                                {displayedCertificate.credentialId && (
                                    <div>
                                        <dt>CREDENTIAL ID</dt>
                                        <dd>{displayedCertificate.credentialId}</dd>
                                    </div>
                                )}
                            </dl>
                            {credentialUrl && (
                                <a
                                    href={credentialUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="portfolio-button portfolio-button--secondary certificate-modal__credential-link"
                                >
                                    <span>
                                        {displayedCertificate.credentialLabel && displayedCertificate.credentialLabel !== "CREDENTIAL"
                                            ? displayedCertificate.credentialLabel
                                            : "VERIFY CREDENTIAL"}
                                    </span>
                                </a>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}

export default CertificateModal;
