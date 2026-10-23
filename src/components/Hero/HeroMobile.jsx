/* =========================================================
   HERO MOBILE
   Subhadeep Adhikary Portfolio
   Mobile-first Hero Experience
   ========================================================= */

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

import profileTransparent from "../../assets/images/hero/profile-transparent.webp";
import "./HeroMobile.css";


/* =========================================================
   HERO DATA
   ========================================================= */

const heroLinks = {
    projects: "#projects",
    about: "#about",
};

/* =========================================================
   COMPONENT
   ========================================================= */

const HeroMobile = () => {
    const heroRef = useRef(null);

    const eyebrowRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const descriptionRef = useRef(null);
    const actionsRef = useRef(null);

    const visualRef = useRef(null);
    const imageRef = useRef(null);

    /* =======================================================
       ENTRANCE ANIMATION
       ======================================================= */

    useEffect(() => {
        const hero = heroRef.current;

        if (!hero) {
            return undefined;
        }

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let ctx;

        try {
            ctx = gsap.context(() => {
                /* ===================================================
                   REDUCED MOTION
                   =================================================== */

                if (reduceMotion) {
                    gsap.set(
                        [
                            eyebrowRef.current,
                            titleRef.current,
                            subtitleRef.current,
                            descriptionRef.current,
                            actionsRef.current,
                            visualRef.current,
                            imageRef.current,
                        ],
                        {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            scale: 1,
                            rotate: 0,
                        }
                    );

                    return;
                }

                /* ===================================================
                   INITIAL STATES
                   =================================================== */

                gsap.set(eyebrowRef.current, {
                    opacity: 0,
                    y: 14,
                });

                gsap.set(titleRef.current, {
                    y: 30,
                });

                gsap.set(subtitleRef.current, {
                    opacity: 0,
                    y: 18,
                });

                gsap.set(descriptionRef.current, {
                    opacity: 0,
                    y: 16,
                });

                gsap.set(actionsRef.current, {
                    y: 16,
                });

                gsap.set(visualRef.current, {
                    opacity: 0,
                    y: 20,
                });

                gsap.set(imageRef.current, {
                    opacity: 0,
                    scale: 0.96,
                });

                /* ===================================================
                   ENTRANCE TIMELINE
                   =================================================== */

                const timeline = gsap.timeline({
                    defaults: {
                        ease: "power3.out",
                    },
                });

                timeline
                    .to(visualRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 0.65,
                    })
                    .to(
                        imageRef.current,
                        {
                            opacity: 1,
                            scale: 1,
                            duration: 0.7,
                        },
                        "-=0.4"
                    )
                    .to(
                        eyebrowRef.current,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.55,
                        },
                        "-=0.25"
                    )
                    .to(
                        titleRef.current,
                        {
                            y: 0,
                            duration: 0.75,
                        },
                        "-=0.28"
                    )
                    .to(
                        subtitleRef.current,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.55,
                        },
                        "-=0.3"
                    )
                    .to(
                        descriptionRef.current,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                        },
                        "-=0.25"
                    )
                    .to(
                        actionsRef.current,
                        {
                            y: 0,
                            duration: 0.5,
                        },
                        "-=0.2"
                    );
            }, hero);
        } catch {
            [
                eyebrowRef.current,
                titleRef.current,
                subtitleRef.current,
                descriptionRef.current,
                actionsRef.current,
                visualRef.current,
                imageRef.current,
            ].forEach((element) => {
                element?.style.removeProperty("opacity");
                element?.style.removeProperty("transform");
            });
        }

        return () => ctx?.revert();
    }, []);

    /* =======================================================
       SMOOTH SCROLL
       ======================================================= */

    const handleScrollTo = (event, target) => {
        event.preventDefault();

        const element = document.querySelector(target);

        if (!element) {
            return;
        }

        const sectionId = target.replace(/^#/, "");
        if (window.location.hash !== `#${sectionId}`) {
            window.history.pushState(null, "", `#${sectionId}`);
        }

        element.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",
            block: "start",
        });
    };

    /* =======================================================
       RENDER
       ======================================================= */

    return (
        <section
            ref={heroRef}
            id="top"
            className="hero-mobile"
            aria-labelledby="hero-mobile-title"
        >
            <div className="hero-mobile__container">
                <div
                    ref={visualRef}
                    className="hero-mobile__profile"
                >
                    <img
                        ref={imageRef}
                        src={profileTransparent}
                        alt="Portrait of Subhadeep Adhikary"
                        className="hero-mobile__profile-image"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        draggable="false"
                    />
                </div>

                {/* =================================================
            INTRO
            ================================================= */}

                <div className="hero-mobile__intro">
                    {/* Eyebrow */}
                    <div
                        ref={eyebrowRef}
                        className="hero-mobile__eyebrow"
                    >
                        Hello, I'm
                    </div>

                    <div className="hero-mobile__identity">
                        {/* Main heading */}
                        <h1
                            ref={titleRef}
                            id="hero-mobile-title"
                            className="hero-mobile__title"
                        >
                            SUBHADEEP{" "}
                            <span className="hero-mobile__title-accent">ADHIKARY</span>
                        </h1>

                        {/* Professional positioning */}
                        <div
                            ref={subtitleRef}
                            className="hero-mobile__subtitle"
                        >
                            <span>B.TECH CSE | DEVELOPER | AI | CONTENT CREATOR</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p
                        ref={descriptionRef}
                        className="hero-mobile__description"
                    >
                        I'm building practical software and security focused projects
                        while exploring AI, Editing, Technologies and Computer Science & 
                        Engineering
                    </p>

                    {/* =================================================
              ACTIONS
              ================================================= */}

                    <div
                        ref={actionsRef}
                        className="hero-mobile__actions"
                    >
                        <a
                            href={heroLinks.projects}
                            className="hero-mobile__button hero-mobile__button--primary portfolio-button portfolio-button--primary"
                            onClick={(event) =>
                                handleScrollTo(event, heroLinks.projects)
                            }
                        >
                            <span>
                                VIEW PROJECTS
                            </span>

                        </a>

                        <a
                            href={heroLinks.about}
                            className="hero-mobile__button hero-mobile__button--secondary portfolio-button portfolio-button--secondary"
                            onClick={(event) =>
                                handleScrollTo(event, heroLinks.about)
                            }
                        >
                            <span>
                                ABOUT ME
                            </span>

                        </a>

                    </div>
                </div>

            </div>

        </section>
    );
};

export default HeroMobile;
