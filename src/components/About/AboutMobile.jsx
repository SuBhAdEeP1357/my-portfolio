import profileAbout from "../../assets/images/about/profile-about.webp";
import { aboutDescription, academicInformation } from "../../data/about";
import "./AboutMobile.css";

const AboutMobile = () => (
    <section
        id="about"
        className="about-mobile"
        aria-labelledby="about-mobile-title"
    >
        <div className="about-mobile__layout">
            <header className="about-mobile__heading">
                <h2 id="about-mobile-title" className="about-mobile__section-title">
                    ABOUT<span className="about-mobile__section-title-accent"> ME</span>
                </h2>
            </header>

            <figure className="about-mobile__portrait">
                <div className="about-mobile__portrait-surface">
                    <img
                        src={profileAbout}
                        alt="Portrait of Subhadeep Adhikary"
                        className="about-mobile__portrait-image"
                        width="1082"
                        height="1352"
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            </figure>

            <p className="about-mobile__description">{aboutDescription}</p>

            <section
                className="about-mobile__academic"
                aria-labelledby="about-mobile-academic-title"
            >
                <h3
                    id="about-mobile-academic-title"
                    className="about-mobile__academic-title"
                >
                    Academic Information
                </h3>

                <dl className="about-mobile__academic-list">
                    {academicInformation.map(({ label, value }) => (
                        <div className="about-mobile__academic-row" key={label}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </div>
    </section>
);

export default AboutMobile;
