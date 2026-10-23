// ================================================================
// DEVICE MODE HOOK
// PORTFOLIO/hooks/useDeviceMode.js
// ================================================================

import { useEffect, useState } from "react";

// Keep compact layouts paired with the existing <=900px responsive CSS,
// and include portrait tablet viewports beyond it.
const COMPACT_VIEWPORT_WIDTH = 900;
const PORTRAIT_TABLET_MAX_WIDTH = 1280;
const PORTRAIT_TABLET_MIN_RATIO = 1.1;

const getDeviceMode = () => {
    if (typeof window === "undefined") {
        return "desktop";
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait =
        height > width || window.matchMedia("(orientation: portrait)").matches;
    const isTouchFirst =
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(hover: none)").matches;

    if (width <= COMPACT_VIEWPORT_WIDTH) {
        return "mobile";
    }

    const isPortraitTablet =
        isPortrait &&
        width <= PORTRAIT_TABLET_MAX_WIDTH &&
        (isTouchFirst ||
            height / Math.max(width, 1) >= PORTRAIT_TABLET_MIN_RATIO);

    return width <= COMPACT_VIEWPORT_WIDTH || isPortraitTablet
        ? "mobile"
        : "desktop";
};

const useDeviceMode = () => {
    const [deviceMode, setDeviceMode] = useState(getDeviceMode);

    useEffect(() => {
        const updateDeviceMode = () => {
            setDeviceMode(getDeviceMode());
        };

        const mediaQueries = [
            window.matchMedia("(orientation: portrait)"),
            window.matchMedia("(pointer: coarse)"),
            window.matchMedia("(hover: none)"),
        ];

        updateDeviceMode();
        window.addEventListener("resize", updateDeviceMode, { passive: true });
        window.addEventListener("orientationchange", updateDeviceMode);
        mediaQueries.forEach((query) => {
            query.addEventListener("change", updateDeviceMode);
        });

        return () => {
            window.removeEventListener("resize", updateDeviceMode);
            window.removeEventListener("orientationchange", updateDeviceMode);
            mediaQueries.forEach((query) => {
                query.removeEventListener("change", updateDeviceMode);
            });
        };
    }, []);

    return {
        deviceMode,
        isDesktop: deviceMode === "desktop",
        isMobile: deviceMode === "mobile",
    };
};

export default useDeviceMode;
