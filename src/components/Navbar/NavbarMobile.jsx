import { useCallback, useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import navbarLogo from "../../assets/branding/navbar.webp";
import {
    navigateToSection,
    navigationItems,
    prefersReducedMotion,
    useActiveSection,
} from "./navigation";
import "./NavbarMobile.css";

const NavbarMobile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [activeSection, setActiveSection] = useActiveSection();
    const isScrollLocked = isOpen || isClosing;
    const menuButtonRef = useRef(null);
    const firstLinkRef = useRef(null);
    const panelRef = useRef(null);
    const closeTimerRef = useRef(null);
    const afterCloseRef = useRef(null);
    const restoreFocusRef = useRef(false);

    const closeMenu = useCallback((afterClose) => {
        setIsOpen(false);
        setIsClosing(true);
        restoreFocusRef.current = true;
        afterCloseRef.current = afterClose ?? null;
        window.clearTimeout(closeTimerRef.current);

        const delay = prefersReducedMotion() ? 0 : 270;
        closeTimerRef.current = window.setTimeout(() => {
            setIsClosing(false);
        }, delay);
    }, []);

    useEffect(() => {
        if (!isScrollLocked) {return undefined;}

        const body = document.body;
        const previousScrollY = window.scrollY;
        const previousStyles = {
            position: body.style.position,
            top: body.style.top,
            width: body.style.width,
            overflow: body.style.overflow,
            paddingRight: body.style.paddingRight,
        };
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        body.classList.add("navbar-mobile-menu-open");
        body.style.position = "fixed";
        body.style.top = `-${previousScrollY}px`;
        body.style.width = "100%";
        body.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
            const currentPadding = Number.parseFloat(
                window.getComputedStyle(body).paddingRight
            ) || 0;
            body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
        }

        return () => {
            body.classList.remove("navbar-mobile-menu-open");
            Object.assign(body.style, previousStyles);
            window.scrollTo({ top: previousScrollY, left: 0, behavior: "instant" });
        };
    }, [isScrollLocked]);

    useEffect(() => {
        if (isOpen || isClosing || !restoreFocusRef.current) {return;}

        restoreFocusRef.current = false;
        menuButtonRef.current?.focus();
        afterCloseRef.current?.();
        afterCloseRef.current = null;
    }, [isOpen, isClosing]);

    useEffect(() => {
        if (!isOpen) {return undefined;}

        const frameId = window.requestAnimationFrame(() => {
            firstLinkRef.current?.focus();
        });

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeMenu();
                return;
            }

            if (event.key !== "Tab" || !panelRef.current) {return;}

            const focusable = panelRef.current.querySelectorAll(
                'a[href], button:not([disabled])'
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, closeMenu]);

    useEffect(() => () => {
        window.clearTimeout(closeTimerRef.current);
    }, []);

    const toggleMenu = () => {
        if (isOpen) {
            closeMenu();
            return;
        }

        window.clearTimeout(closeTimerRef.current);
        restoreFocusRef.current = false;
        afterCloseRef.current = null;
        setIsClosing(false);
        setIsOpen(true);
    };

    const handleNavigation = (event, sectionId) => {
        event.preventDefault();
        setActiveSection(sectionId);
        const navbarBottom = document
            .querySelector(".navbar-mobile")
            ?.getBoundingClientRect().bottom ?? 76;
        const navigationOffset = navbarBottom + 12;

        if (isOpen) {
            closeMenu(() => navigateToSection(sectionId, navigationOffset));
        } else {
            navigateToSection(sectionId, navigationOffset);
        }
    };

    return (
        <>
            <header
                className={`navbar-mobile${isScrollLocked ? " navbar-mobile--menu-open" : ""}`}
                aria-hidden={isScrollLocked}
                inert={isScrollLocked}
            >
                <div className="navbar-mobile__inner">
                    <a
                        href="#top"
                        className="navbar-mobile__brand"
                        aria-label="Go to Home"
                        onClick={(event) => handleNavigation(event, "top")}
                    >
                        <img
                            src={navbarLogo}
                            alt=""
                            aria-hidden="true"
                            className="navbar-mobile__brand-logo"
                            draggable="false"
                        />
                    </a>

                    <button
                        ref={menuButtonRef}
                        type="button"
                        className="navbar-mobile__menu-button"
                        onClick={toggleMenu}
                        aria-expanded={isOpen}
                        aria-controls="mobile-navigation"
                        aria-haspopup="dialog"
                        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    >
                        <span className="navbar-mobile__menu-icon" aria-hidden="true">
                            {isOpen ? <FiX /> : <FiMenu />}
                        </span>
                    </button>
                </div>
            </header>

            <div
                className={`navbar-mobile__overlay${isOpen ? " navbar-mobile__overlay--visible" : ""}`}
                aria-hidden="true"
                onClick={() => closeMenu()}
            />

            <aside
                ref={panelRef}
                id="mobile-navigation-panel"
                className={`navbar-mobile__panel${isOpen ? " navbar-mobile__panel--open" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
                aria-hidden={!isOpen}
                inert={!isOpen}
            >
                <div className="navbar-mobile__panel-content">
                    <div className="navbar-mobile__panel-header">
                        <a
                            href="#top"
                            className="navbar-mobile__panel-brand"
                            aria-label="Go to Home"
                            onClick={(event) => handleNavigation(event, "top")}
                        >
                            <img src={navbarLogo} alt="" aria-hidden="true" draggable="false" />
                        </a>
                        <button
                            type="button"
                            className="navbar-mobile__close-button"
                            aria-label="Close navigation"
                            onClick={() => closeMenu()}
                        >
                            <FiX aria-hidden="true" />
                        </button>
                    </div>

                    <nav
                        id="mobile-navigation"
                        className="navbar-mobile__nav"
                        aria-label="Primary navigation"
                    >
                        <ul className="navbar-mobile__list">
                            {navigationItems.map((item, index) => {
                                const isActive = activeSection === item.id;

                                return (
                                    <li
                                        key={item.id}
                                        className="navbar-mobile__item"
                                        style={{ "--nav-stagger-index": index }}
                                    >
                                        <a
                                            ref={index === 0 ? firstLinkRef : undefined}
                                            href={item.href}
                                            className={`navbar-mobile__link${isActive ? " navbar-mobile__link--active" : ""}`}
                                            aria-current={isActive ? "location" : undefined}
                                            onClick={(event) => handleNavigation(event, item.id)}
                                        >
                                            <span className="navbar-mobile__label">{item.label}</span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                    <a
                        href="#contact"
                        className="navbar-mobile__contact portfolio-button portfolio-button--primary"
                        onClick={(event) => handleNavigation(event, "contact")}
                    >
                        LET&apos;S TALK
                    </a>
                </div>
            </aside>
        </>
    );
};

export default NavbarMobile;
