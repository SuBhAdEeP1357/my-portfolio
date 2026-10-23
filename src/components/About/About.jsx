import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import profileAbout from "../../assets/images/about/profile-about.webp";
import { aboutDescription, academicInformation } from "../../data/about";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const sectionRef = useRef(null);
    const portraitRef = useRef(null);
    const headingRef = useRef(null);
    const descriptionRef = useRef(null);
    const academicRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section) {
            return undefined;
        }

        const media = gsap.matchMedia();
        const context = gsap.context(() => {
            media.add("(prefers-reduced-motion: no-preference)", () => {
                gsap.fromTo(
                    [
                        portraitRef.current,
                        headingRef.current,
                        descriptionRef.current,
                        academicRef.current,
                    ],
                    { y: 10 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.65,
                        stagger: 0.08,
                        ease: "power2.out",
                        clearProps: "transform",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 82%",
                            once: true,
                        },
                    }
                );

            });
        }, section);

        return () => {
            media.revert();
            context.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="about-section"
            aria-labelledby="about-title"
        >
            <div className="about-section__container">
                <figure ref={portraitRef} className="about-section__portrait">
                    <div className="about-section__portrait-surface">
                        <img
                            src={profileAbout}
                            alt="Portrait of Subhadeep Adhikary"
                            className="about-section__portrait-image"
                            width="1082"
                            height="1352"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </figure>

                <div className="about-section__content">
                    <h2
                        ref={headingRef}
                        id="about-title"
                        className="about-section__title"
                    >
                        ABOUT<span className="about-section__title-accent"> ME</span>
                    </h2>

                    <p ref={descriptionRef} className="about-section__description">
                        {aboutDescription}
                    </p>

                    <section
                        ref={academicRef}
                        className="about-section__academic"
                        aria-labelledby="about-academic-title"
                    >
                        <h3
                            id="about-academic-title"
                            className="about-section__academic-title"
                        >
                            Academic Information
                        </h3>

                        <dl className="about-section__academic-list">
                            {academicInformation.map(({ label, value }) => (
                                <div className="about-section__academic-row" key={label}>
                                    <dt>{label}</dt>
                                    <dd>{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                </div>
            </div>
        </section>
    );
};

export default About;
