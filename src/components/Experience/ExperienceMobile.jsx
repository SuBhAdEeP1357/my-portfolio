import { useRef } from "react";

import experience from "../../data/experience";
import useExperienceReveal from "./useExperienceReveal";
import "./Experience.css";
import "./ExperienceMobile.css";

function ExperienceMobile() {
    const sectionRef = useRef(null);

    useExperienceReveal(sectionRef);

    return (
        <section
            ref={sectionRef}
            className="experience-editorial experience-editorial--mobile"
            id="experience"
            aria-labelledby="experience-mobile-title"
        >
            <div className="experience-editorial__mobile-container">
                <header
                    className="experience-editorial__mobile-header"
                    data-experience-reveal
                >
                    <h2
                        className="experience-editorial__mobile-title"
                        id="experience-mobile-title"
                    >
                        EXPERIENCE
                    </h2>
                </header>

                <article
                    className="experience-editorial__mobile-entry"
                    aria-labelledby="experience-mobile-company-title"
                >
                    <div
                        className="experience-editorial__mobile-identity"
                        data-experience-reveal
                    >
                        <p className="experience-editorial__role">
                            {experience.role}
                        </p>
                        <h3 id="experience-mobile-company-title">
                            {experience.company}
                        </h3>
                        <p className="experience-editorial__mobile-mode">
                            {experience.workMode} · {experience.engagement}
                        </p>

                        <dl className="experience-editorial__mobile-facts">
                            <div className="experience-editorial__mobile-period">
                                <dt>PERIOD</dt>
                                <dd>{experience.period}</dd>
                            </div>
                            <div>
                                <dt>WORK MODE</dt>
                                <dd>{experience.workMode}</dd>
                            </div>
                            <div>
                                <dt>TYPE</dt>
                                <dd>{experience.engagement}</dd>
                            </div>
                        </dl>
                    </div>

                    <div
                        className="experience-editorial__mobile-details"
                        data-experience-reveal
                    >
                        <p className="experience-editorial__mobile-summary">
                            {experience.summary}
                        </p>

                        <section
                            className="experience-editorial__mobile-work"
                            aria-labelledby="experience-mobile-work-title"
                        >
                            <h4
                                className="experience-editorial__section-label"
                                id="experience-mobile-work-title"
                            >
                                PROJECT WORK
                            </h4>
                            <ul className="experience-editorial__mobile-project-list">
                                {experience.projectWork.map((project) => (
                                    <li
                                        className="experience-editorial__mobile-project"
                                        key={project.name}
                                    >
                                        <h5>{project.name}</h5>
                                        <p>{project.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section
                            className="experience-editorial__mobile-technologies"
                            aria-labelledby="experience-mobile-technologies-title"
                        >
                            <h4
                                className="experience-editorial__section-label"
                                id="experience-mobile-technologies-title"
                            >
                                TECHNOLOGIES
                            </h4>
                            <ul className="experience-editorial__mobile-technology-list">
                                {experience.technologies.map((technology) => (
                                    <li key={technology}>{technology}</li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </article>
            </div>
        </section>
    );
}

export default ExperienceMobile;
