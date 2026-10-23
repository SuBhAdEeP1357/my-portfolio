import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import "./Contact.css";

function Contact() {
    return (
        <section
            className="contact-section"
            id="contact"
            aria-labelledby="contact-title"
        >
            <div className="contact__container">
                <header className="contact__heading">
                    <h2 className="contact__title" id="contact-title">
                        CONTACT
                    </h2>
                </header>

                <div className="contact-main-grid">
                    <ContactInfo />

                    <section
                        className="contact__form-panel"
                        aria-labelledby="contact-talk-title"
                    >
                        <h3
                            className="contact__form-title"
                            id="contact-talk-title"
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

export default Contact;
