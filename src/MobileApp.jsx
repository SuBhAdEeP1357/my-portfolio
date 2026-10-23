// ================================================================
// MOBILE APPLICATION
// PORTFOLIO/src/MobileApp.jsx
// ================================================================

import Preloader from "./components/Preloader/Preloader";

import NavbarMobile from "./components/Navbar/NavbarMobile";
import HeroMobile from "./components/Hero/HeroMobile";
import AboutMobile from "./components/About/AboutMobile";
import SkillsMobile from "./components/Skills/SkillsMobile";
import ProjectsMobile from "./components/Projects/ProjectsMobile";
import ExperienceMobile from "./components/Experience/ExperienceMobile";
import CertificationsMobile from "./components/Certifications/CertificationsMobile";
import ContactMobile from "./components/Contact/ContactMobile";

import Footer from "./components/Footer/Footer";

// ================================================================
// MOBILE APP
// ================================================================

const MobileApp = () => {
    return (
        <>
            {/* ==========================================================
          GLOBAL MOBILE UI
          ========================================================== */}

            <Preloader />

            <NavbarMobile />

            {/* ==========================================================
          MAIN CONTENT
          ========================================================== */}

            <main id="main-content" tabIndex={-1}>
                <HeroMobile />
                <AboutMobile />
                <SkillsMobile />
                <ProjectsMobile />
                <ExperienceMobile />
                <CertificationsMobile />
                <ContactMobile />
            </main>

            {/* ==========================================================
          FOOTER
          ========================================================== */}

            <Footer />
        </>
    );
};

export default MobileApp;
