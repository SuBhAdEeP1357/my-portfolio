import socialLinks from "../../data/socialLinks";
import "./Footer.css";

const externalSocialLinks = socialLinks.filter((social) => social.external);

const Footer = () => (
    <footer className="site-footer" aria-label="Website footer">
        <div className="site-footer__container">
            <div className="site-footer__divider" aria-hidden="true" />

            <div className="site-footer__content">
                <nav aria-label="Social profiles">
                    <ul className="site-footer__social-list">
                        {externalSocialLinks.map((social) => {
                            const Icon = social.icon;

                            return (
                                <li key={social.id}>
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="site-footer__social"
                                    >
                                        <Icon aria-hidden="true" />
                                        <span>{social.label}</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <p className="site-footer__copyright">
                    © {new Date().getFullYear()} SUBHADEEP ADHIKARY. ALL RIGHTS
                    RESERVED.
                </p>
                <p className="site-footer__location">
                    ASANSOL, WEST BENGAL, INDIA
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;
