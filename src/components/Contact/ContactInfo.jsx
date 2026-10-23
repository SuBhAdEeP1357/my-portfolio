import { FiMapPin } from "react-icons/fi";

import socialLinks from "../../data/socialLinks";
import "./ContactInfo.css";

const contactLinks = socialLinks.filter((link) => link.url && link.icon);

function ContactInfo() {
    return (
        <div className="contact-info">
            <nav className="contact-info__nav" aria-labelledby="contact-connect-title">
                <h3 className="contact-info__title" id="contact-connect-title">
                    CONNECT
                </h3>

                <ul className="contact-info__list">
                    {contactLinks.map((link) => {
                        const Icon = link.icon;

                        return (
                            <li className="contact-info__list-item" key={link.id}>
                                <a
                                    className="contact-info__link"
                                    href={link.url}
                                    target={link.external ? "_blank" : undefined}
                                    rel={link.external ? "noopener noreferrer" : undefined}
                                    aria-label={`${link.contactLabel}: ${link.value}`}
                                >
                                    <span className="contact-info__icon">
                                        <Icon aria-hidden="true" />
                                    </span>
                                    <span className="contact-info__link-copy">
                                        <span className="contact-info__label">
                                            {link.contactLabel}
                                        </span>
                                        <span className="contact-info__value">
                                            {link.value}
                                        </span>
                                    </span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="contact-info__location">
                <span className="contact-info__icon" aria-hidden="true">
                    <FiMapPin />
                </span>
                <div className="contact-info__location-copy">
                    <span className="contact-info__label">BASED IN</span>
                    <address className="contact-info__value">
                        Asansol, West Bengal, India
                    </address>
                </div>
            </div>
        </div>
    );
}

export default ContactInfo;
