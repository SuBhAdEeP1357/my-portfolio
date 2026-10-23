import { useRef } from "react";
import navbarLogo from "../../assets/branding/navbar.webp";
import {
    navigateToSection,
    navigationItems,
    useActiveSection,
} from "./navigation";
import "./Navbar.css";

const Navbar = () => {
    const navRef = useRef(null);
    const [activeSection, setActiveSection] = useActiveSection();

    const handleNavigation = (event, sectionId) => {
        event.preventDefault();
        setActiveSection(sectionId);
        const navbarBottom = navRef.current?.getBoundingClientRect().bottom ?? 86;
        navigateToSection(sectionId, navbarBottom + 12);
    };

    return (
        <header
            ref={navRef}
            className="navbar"
        >
            <div className="navbar__inner">
                <a
                    href="#top"
                    className="navbar__brand"
                    aria-label="Go to Home"
                    onClick={(event) => handleNavigation(event, "top")}
                >
                    <img
                        src={navbarLogo}
                        alt=""
                        aria-hidden="true"
                        className="navbar__brand-logo"
                        draggable="false"
                    />
                </a>

                <nav
                    className="navbar__desktop-nav"
                    aria-label="Primary navigation"
                >
                    <ul className="navbar__desktop-list">
                        {navigationItems.map((item) => {
                            const isActive = activeSection === item.id;

                            return (
                                <li key={item.id} className="navbar__desktop-item">
                                    <a
                                        href={item.href}
                                        className={`navbar__desktop-link${isActive ? " navbar__desktop-link--active" : ""}`}
                                        aria-current={isActive ? "location" : undefined}
                                        onClick={(event) => handleNavigation(event, item.id)}
                                    >
                                        <span className="navbar__desktop-label">
                                            {item.label}
                                        </span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <a
                    href="#contact"
                    className="navbar__contact portfolio-button portfolio-button--primary"
                    onClick={(event) => handleNavigation(event, "contact")}
                >
                    <span>LET&apos;S TALK</span>
                </a>
            </div>
        </header>
    );
};

export default Navbar;
