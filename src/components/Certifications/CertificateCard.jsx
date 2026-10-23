import { getCredentialUrl } from "./certificationUtils";

function CertificateCard({ certificate, position, idPrefix, onViewCertificate }) {
    const {
        id,
        title,
        issuer,
        date,
        category,
        type,
        image,
        credentialId,
        credentialLabel,
        credentialUrl: rawCredentialUrl,
    } = certificate;
    const credentialUrl = getCredentialUrl(rawCredentialUrl);
    const titleId = `${idPrefix}-${id}-title`;

    return (
        <article className="credential-archive__card" aria-labelledby={titleId}>
            <figure className="credential-archive__media">
                <button
                    type="button"
                    className="credential-archive__preview"
                    onClick={() => onViewCertificate(certificate)}
                    aria-label={`View certificate: ${title}`}
                >
                    <img
                        src={image}
                        alt={`Certificate — ${title} — ${issuer}`}
                        loading={position === 0 ? "eager" : "lazy"}
                        fetchPriority={position === 0 ? "high" : "auto"}
                        decoding="async"
                    />
                </button>
            </figure>

            <div className="credential-archive__content">
                <dl className="credential-archive__meta">
                    <div>
                        <dt>ISSUER</dt>
                        <dd>{issuer}</dd>
                    </div>
                    <div>
                        <dt>DATE</dt>
                        <dd>{date}</dd>
                    </div>
                    {credentialId && (
                        <div className="credential-archive__credential-id">
                            <dt>CREDENTIAL ID</dt>
                            <dd>{credentialId}</dd>
                        </div>
                    )}
                </dl>

                <h3 id={titleId} className="credential-archive__card-title">
                    {title}
                </h3>

                {(category || type) && (
                    <p className="credential-archive__classification">
                        {category && (
                            <span className="credential-archive__classification-category">
                                {category}
                            </span>
                        )}
                        {category && type && <span aria-hidden="true">·</span>}
                        {type && <span>{type}</span>}
                    </p>
                )}

                {credentialUrl && (
                    <div className="credential-archive__actions">
                        <a
                            href={credentialUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="portfolio-button portfolio-button--secondary"
                            aria-label={`${credentialLabel && credentialLabel !== "CREDENTIAL" ? credentialLabel : "Verify credential"}: ${title}`}
                        >
                            <span>
                                {credentialLabel && credentialLabel !== "CREDENTIAL"
                                    ? credentialLabel
                                    : "VERIFY CREDENTIAL"}
                            </span>
                        </a>
                    </div>
                )}
            </div>
        </article>
    );
}

export default CertificateCard;
