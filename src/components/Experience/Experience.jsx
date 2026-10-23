import { useRef } from "react";

import experience from "../../data/experience";
import useExperienceReveal from "./useExperienceReveal";
import "./Experience.css";

function ProjectWork() {
    return (
        <section
            className="experience-editorial__work"
            aria-labelledby="experience-work-title"
        >
            <h4
                className="experience-editorial__section-label"
                id="experience-work-title"
            >
                PROJECT WORK
            </h4>

            <ul className="experience-editorial__project-list">
                {experience.projectWork.map((project) => (
                    <li
                        className="experience-editorial__project"
                        key={project.name}
                    >
                        <h5>{project.name}</h5>
                        <p>{project.description}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function Technologies() {
    return (
        <section
            className="experience-editorial__technologies"
            aria-labelledby="experience-technologies-title"
        >
            <h4
                className="experience-editorial__section-label"
                id="experience-technologies-title"
            >
                TECHNOLOGIES
            </h4>

            <ul className="experience-editorial__technology-list">
                {experience.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                ))}
            </ul>
        </section>
    );
}

function Experience() {
    const sectionRef = useRef(null);

    useExperienceReveal(sectionRef);

    return (
        <section
            ref={sectionRef}
            className="experience-editorial experience-editorial--desktop"
            id="experience"
            aria-labelledby="experience-title"
        >
            <div className="experience-editorial__container">
                <header
                    className="experience-editorial__header"
                    data-experience-reveal
                >
                    <h2
                        className="experience-editorial__title"
                        id="experience-title"
                    >
                        EXPERIENCE
                    </h2>
                </header>

                <article
                    className="experience-editorial__entry"
                    aria-labelledby="experience-company-title"
                >
                    <div
                        className="experience-editorial__identity"
                        data-experience-reveal
                    >
                        <p className="experience-editorial__role">
                            {experience.role}
                        </p>
                        <h3 id="experience-company-title">
                            {experience.company}
                        </h3>
                        <p className="experience-editorial__engagement">
                            {experience.workMode} {experience.engagement}
                        </p>

                        <dl className="experience-editorial__facts">
                            <div>
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
                        className="experience-editorial__details"
                        data-experience-reveal
                    >
                        <p className="experience-editorial__summary">
                            {experience.summary}
                        </p>
                        <ProjectWork />
                        <Technologies />
                    </div>
                </article>
            </div>
        </section>
    );
}

export default Experience;
