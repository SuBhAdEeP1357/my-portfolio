/* =========================================================
   HERO SECTION
   Subhadeep Adhikary Portfolio
   ========================================================= */

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FiGithub } from "react-icons/fi";

import profileTransparent from "../../assets/images/hero/profile-transparent.webp";


/* =========================================================
   HERO DATA
   ========================================================= */

const heroLinks = {
    projects: "#projects",
    about: "#about",
    github: "https://github.com/SuBhAdEeP1357",
};

/* =========================================================
   COMPONENT
   ========================================================= */

const Hero = () => {
    const heroRef = useRef(null);

    const eyebrowRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const descriptionRef = useRef(null);
    const actionsRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const hero = heroRef.current;

        if (!hero) {
            return undefined;
        }

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const ctx = gsap.context(() => {
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
                        imageRef.current,
                    ],
                    {
                        opacity: 1,
                        y: 0,
                        x: 0,
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
                y: 18,
            });

            gsap.set(titleRef.current, {
                opacity: 0,
                y: 45,
            });

            gsap.set(subtitleRef.current, {
                opacity: 0,
                y: 28,
            });

            gsap.set(descriptionRef.current, {
                opacity: 0,
                y: 22,
            });

            gsap.set(actionsRef.current, {
                opacity: 0,
                y: 22,
            });

            gsap.set(imageRef.current, {
                opacity: 0,
                scale: 0.94,
                y: 20,
            });

            /* ===================================================
               HERO ENTRANCE
               =================================================== */

            const timeline = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                },
            });

            timeline
                .to(eyebrowRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                })
                .to(
                    titleRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                    },
                    "-=0.38"
                )
                .to(
                    subtitleRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.75,
                    },
                    "-=0.5"
                )
                .to(
                    descriptionRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                    },
                    "-=0.38"
                )
                .to(
                    actionsRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                    },
                    "-=0.35"
                )
                .to(
                    imageRef.current,
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 1.05,
                        ease: "power3.out",
                    },
                    "-=0.8"
                );
        }, hero);

        return () => ctx.revert();
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
            className="hero"
            aria-labelledby="hero-title"
        >
            {/* ===================================================
          AMBIENT BACKGROUND
          =================================================== */}

            <div
                className="hero__ambient"
                aria-hidden="true"
            >
                <div className="hero__grid" />

                <span className="hero__orb hero__orb--one" />
                <span className="hero__orb hero__orb--two" />
                <span className="hero__orb hero__orb--three" />

                <div className="hero__vertical-line hero__vertical-line--left" />
                <div className="hero__vertical-line hero__vertical-line--right" />
            </div>

            {/* ===================================================
          MAIN CONTAINER
          =================================================== */}

            <div className="hero__container">
                {/* =================================================
            LEFT CONTENT
            ================================================= */}

                <div className="hero__content">
                    {/* Eyebrow */}
                    <div
                        ref={eyebrowRef}
                        className="hero__eyebrow"
                    >
                        Hello, I'm
                    </div>

                    <div className="hero__identity">
                        {/* Main heading */}
                        <h1
                            ref={titleRef}
                            id="hero-title"
                            className="hero__title"
                        >
                            <span className="hero__title-line">
                                SUBHADEEP
                            </span>

                            <span className="hero__title-line hero__title-line--accent">
                                ADHIKARY
                            </span>
                        </h1>

                        {/* Professional positioning */}
                        <div
                            ref={subtitleRef}
                            className="hero__subtitle"
                        >
                            <span>B.TECH CSE  |  DEVELOPER  |  CYBERSECURITY  |  AI  |  CONTENT CREATOR</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p
                        ref={descriptionRef}
                        className="hero__description"
                    >
                        I build practical software and security-focused projects
                        while continuously exploring AI, Cybersecurity, Technologies, Website Development
                        & Computer Science Tools.
                    </p>

                    {/* Actions */}
                    <div
                        ref={actionsRef}
                        className="hero__actions"
                    >
                        <a
                            href={heroLinks.projects}
                            className="hero__button hero__button--primary portfolio-button portfolio-button--primary"
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
                            className="hero__button hero__button--secondary portfolio-button portfolio-button--secondary"
                            onClick={(event) =>
                                handleScrollTo(event, heroLinks.about)
                            }
                        >
                            <span>
                                ABOUT ME
                            </span>

                        </a>

                        <a
                            href={heroLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero__github portfolio-button portfolio-button--secondary"
                            aria-label="Visit Subhadeep Adhikary on GitHub"
                        >
                            <FiGithub aria-hidden="true" />

                            <span>
                                GITHUB
                            </span>
                        </a>
                    </div>
                </div>

            </div>

            <div className="hero-profile" aria-hidden="true">
                <img
                    ref={imageRef}
                    src={profileTransparent}
                    alt=""
                    className="hero-profile__image"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    draggable="false"
                />
            </div>

        </section>
    );
};

export default Hero;
