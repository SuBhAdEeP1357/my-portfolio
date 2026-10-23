import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import "./ContactMobile.css";

function ContactMobile() {
    return (
        <section
            className="contact-mobile"
            id="contact"
            aria-labelledby="contact-mobile-title"
        >
            <div className="contact-mobile__container">
                <header className="contact-mobile__heading">
                    <h2
                        className="contact-mobile__title"
                        id="contact-mobile-title"
                    >
                        CONTACT
                    </h2>
                </header>

                <div className="contact-mobile__content">
                    <ContactInfo />

                    <section
                        className="contact-mobile__form-panel"
                        aria-labelledby="contact-mobile-talk-title"
                    >
                        <h3
                            className="contact-mobile__form-title"
                            id="contact-mobile-talk-title"
                        >
                            LET&apos;S TALK
                        </h3>
                        <ContactForm />
                    </section>
                </div>
            </div>
        </section>
    );
}

export default ContactMobile;
