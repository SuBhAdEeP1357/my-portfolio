import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import skills from "../../data/skills";
import "./Skills.css";

gsap.registerPlugin(ScrollTrigger);

const { skillGroups } = skills;

export default function Skills() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;

        if (
            !section ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return undefined;
        }

        const context = gsap.context(() => {
            section
                .querySelectorAll(".skills-showcase__category")
                .forEach((category) => {
                    gsap.fromTo(
                        category,
                        { autoAlpha: 0, y: 10 },
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.42,
                            ease: "power2.out",
                            clearProps: "transform,visibility,opacity",
                            scrollTrigger: {
                                trigger: category,
                                start: "top 92%",
                                once: true,
                            },
                        }
                    );

                    const cards = category.querySelectorAll(
                        ".skills-showcase__skill"
                    );

                    if (cards.length > 0) {
                        gsap.fromTo(
                            cards,
                            { autoAlpha: 0, y: 6 },
                            {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.36,
                                stagger: 0.035,
                                ease: "power2.out",
                                clearProps: "transform,visibility,opacity",
                                scrollTrigger: {
                                    trigger: category,
                                    start: "top 89%",
                                    once: true,
                                },
                            }
                        );
                    }
                });
        }, section);

        return () => context.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="skills"
            className="skills-showcase"
            aria-labelledby="skills-title"
        >
            <div className="skills-showcase__container">
                <header className="skills-showcase__masthead">
                    <h2 id="skills-title" className="skills-showcase__title">
                        SKILLS
                    </h2>
                </header>

                <div className="skills-showcase__grid">
                    {skillGroups.map((group) => (
                        <article
                            key={group.id}
                            className="skills-showcase__category"
                            aria-labelledby={`skills-category-${group.id}`}
                        >
                            <h3
                                id={`skills-category-${group.id}`}
                                className="skills-showcase__category-title"
                            >
                                {group.title}
                            </h3>

                            <ul className="skills-showcase__list">
                                {group.skills.map((skill) => (
                                    <li
                                        key={`${group.id}-${skill.name}`}
                                        className="skills-showcase__skill"
                                    >
                                        {skill.icon && (
                                            <img
                                                className="skills-showcase__icon"
                                                src={skill.icon}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        )}
                                        <span className="skills-showcase__skill-name">
                                            {skill.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
