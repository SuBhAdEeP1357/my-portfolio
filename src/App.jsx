// ================================================================
// ROOT APP
// PORTFOLIO/src/App.jsx
// ================================================================

import { useEffect, useLayoutEffect } from "react";

import useDeviceMode from "./hooks/useDeviceMode";

import DesktopApp from "./DesktopApp";
import MobileApp from "./MobileApp";

// ================================================================
// APP
// ================================================================

const App = () => {
    const { deviceMode, isDesktop, isMobile } = useDeviceMode();

    useLayoutEffect(() => {
        const root = document.documentElement;

        root.classList.toggle("mobile-device", isMobile);

        return () => {
            root.classList.remove("mobile-device");
        };
    }, [isMobile]);

    useEffect(() => {
        const targetId = window.location.hash.slice(1);

        if (!targetId) {
            return undefined;
        }

        let frameId = 0;

        const alignHashTarget = () => {
            const target = document.getElementById(targetId);

            if (!target) {
                return;
            }

            const navbar = document.querySelector(
                isMobile ? ".navbar-mobile" : ".navbar"
            );
            const navbarOffset = navbar?.getBoundingClientRect().height || 0;
            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                navbarOffset;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: "instant",
            });
        };

        const scheduleAlignment = () => {
            window.cancelAnimationFrame(frameId);
            frameId = window.requestAnimationFrame(() => {
                frameId = window.requestAnimationFrame(alignHashTarget);
            });
        };

        scheduleAlignment();
        window.addEventListener("pageshow", scheduleAlignment);

        const timeout = window.setTimeout(scheduleAlignment, 150);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.clearTimeout(timeout);
            window.removeEventListener("pageshow", scheduleAlignment);
        };
    }, [deviceMode, isMobile]);

    const application = isDesktop ? <DesktopApp /> : isMobile ? <MobileApp /> : null;

    return (
        <>
            <a className="skip-link" href="#main-content">
                Skip to main content
            </a>
            {application}
        </>
    );
};

export default App;
