import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import goldSaLogo from "../../assets/branding/SA-logo/SA-logo-gold.webp";
import "./Preloader.css";

const Preloader = () => {
    const [isVisible, setIsVisible] = useState(() =>
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    const preloaderRef = useRef(null);
    const logoRef = useRef(null);
    const loadingRef = useRef(null);
    const progressRef = useRef(null);
    const percentageRef = useRef(null);
    const hasCompletedRef = useRef(false);

    useEffect(() => {
        const preloader = preloaderRef.current;
        const logo = logoRef.current;
        const loading = loadingRef.current;
        const progress = progressRef.current;
        const percentage = percentageRef.current;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion || !preloader) {
            setIsVisible(false);
            return undefined;
        }

        const animations = {
            introTimeline: null,
            progressTween: null,
            exitTimeline: null,
        };

        const fallbackTimer = window.setTimeout(() => {
            hasCompletedRef.current = true;
            animations.introTimeline?.kill();
            animations.progressTween?.kill();
            animations.exitTimeline?.kill();
            setIsVisible(false);
        }, 3500);

        gsap.set(preloader, {
            opacity: 1,
            scale: 1,
            transformOrigin: "center center",
        });

        gsap.set(logo, {
            opacity: 0,
            scale: 0.85,
            filter: "blur(8px)",
        });

        gsap.set(loading, {
            opacity: 0,
            y: 8,
        });

        gsap.set(progress, {
            scaleX: 0,
            transformOrigin: "left center",
        });

        const finishPreloader = () => {
            if (hasCompletedRef.current) {
                return;
            }

            hasCompletedRef.current = true;
            window.clearTimeout(fallbackTimer);

            animations.exitTimeline = gsap.timeline({
                onComplete: () => {
                    setIsVisible(false);
                },
            });

            animations.exitTimeline
                .to(
                    loading,
                    {
                        opacity: 0,
                        y: -4,
                        duration: 0.2,
                        ease: "power2.in",
                    },
                    0
                )
                .to(
                    preloader,
                    {
                        opacity: 0,
                        scale: 1.025,
                        duration: 0.32,
                        ease: "power3.inOut",
                    },
                    0.08
                )
                .set(preloader, {
                    display: "none",
                });
        };

        animations.introTimeline = gsap.timeline();

        animations.introTimeline
            .to(logo, {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.42,
                ease: "power3.out",
            })
            .to(
                loading,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.28,
                    ease: "power2.out",
                },
                "-=0.18"
            );

        const progressState = {
            value: 0,
        };

        animations.progressTween = gsap.to(progressState, {
            value: 100,
            duration: 1.15,
            delay: 0.12,
            ease: "power2.inOut",

            onUpdate: () => {
                const value = Math.round(progressState.value);

                if (percentage) {
                    percentage.textContent = `${String(value).padStart(2, "0")}%`;
                }

                if (progress) {
                    gsap.set(progress, {
                        scaleX: progressState.value / 100,
                    });
                }
            },

            onComplete: finishPreloader,
        });

        return () => {
            animations.introTimeline?.kill();
            animations.progressTween?.kill();
            animations.exitTimeline?.kill();

            window.clearTimeout(fallbackTimer);
        };
    }, []);

    useEffect(() => {
        if (!isVisible) {
            document.body.classList.remove("preloader-active");

            return undefined;
        }

        document.body.classList.add("preloader-active");

        return () => {
            document.body.classList.remove("preloader-active");
        };
    }, [isVisible]);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            ref={preloaderRef}
            className="preloader"
            role="status"
            aria-live="polite"
            aria-label="Loading portfolio"
        >
            <div className="preloader__content">
                <div ref={logoRef} className="preloader__logo">
                    <img
                        className="preloader__logo-image"
                        src={goldSaLogo}
                        alt=""
                        aria-hidden="true"
                        draggable="false"
                    />
                </div>

                <div ref={loadingRef} className="preloader__loading">
                    <span
                        ref={percentageRef}
                        className="preloader__percentage"
                    >
                        00%
                    </span>

                    <div className="preloader__progress-track" aria-hidden="true">
                        <div
                            ref={progressRef}
                            className="preloader__progress-bar"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
