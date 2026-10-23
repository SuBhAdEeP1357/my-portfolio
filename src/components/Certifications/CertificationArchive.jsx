import { useCallback, useState } from "react";
import certifications from "../../data/certifications";
import CertificateCard from "./CertificateCard";
import CertificateModal from "./CertificateModal";

const featuredCertificates = certifications.slice(0, 4);

function CertificationArchive({ mobile = false }) {
    const [modalMode, setModalMode] = useState(null);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [detailOrigin, setDetailOrigin] = useState(null);
    const closeArchive = useCallback(() => {
        setModalMode(null);
        setSelectedCertificate(null);
        setDetailOrigin(null);
    }, []);
    const openArchive = useCallback(() => {
        setSelectedCertificate(null);
        setDetailOrigin(null);
        setModalMode("archive");
    }, []);
    const openCertificate = useCallback((certificate) => {
        if (!certificate) {
            return;
        }

        setDetailOrigin(modalMode === "archive" ? "archive" : "main");
        setSelectedCertificate(certificate);
        setModalMode("preview");
    }, [modalMode]);
    const closeCertificateView = useCallback(() => {
        if (modalMode === "preview" && detailOrigin === "archive") {
            setSelectedCertificate(null);
            setDetailOrigin(null);
            setModalMode("archive");
            return;
        }

        closeArchive();
    }, [closeArchive, detailOrigin, modalMode]);
    const layoutClass = mobile ? " credential-archive--mobile" : "";

    return (
        <>
            <section
                id="certifications"
                className={`credential-archive${layoutClass}`}
                aria-labelledby="certifications-title"
            >
                <div className="credential-archive__container">
                    <header className="credential-archive__header">
                        <div className="project-showcase__heading-row credential-archive__heading-row">
                            <h2
                                id="certifications-title"
                                className="credential-archive__title"
                            >
                                {mobile ? "CERTIFY" : "CERTIFICATIONS"}
                            </h2>
                            <button
                                type="button"
                                className="portfolio-button portfolio-button--secondary project-showcase__view-all"
                                onClick={openArchive}
                                aria-haspopup="dialog"
                                aria-controls="certificate-modal-panel"
                                aria-expanded={
                                    modalMode === "archive" ||
                                    (modalMode === "preview" && detailOrigin === "archive")
                                }
                            >
                                <span>VIEW ALL</span>
                            </button>
                        </div>
                        <p className="credential-archive__intro">
                            Professional credentials and continued learning across
                            cybersecurity, software, and generative AI.
                        </p>
                    </header>

                    <div className="credential-archive__grid credential-archive__grid--featured">
                        {featuredCertificates.map((certificate, position) => (
                            <CertificateCard
                                certificate={certificate}
                                position={position}
                                idPrefix="featured"
                                onViewCertificate={openCertificate}
                                key={certificate.id}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <CertificateModal
                mode={modalMode}
                detailOrigin={detailOrigin}
                certificate={selectedCertificate}
                certificates={certifications}
                onClose={closeCertificateView}
                onViewCertificate={openCertificate}
            />
        </>
    );
}

export default CertificationArchive;
