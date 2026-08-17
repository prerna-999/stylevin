import React from "react";

interface ContactBannerProps {
  titleTop?: string;
  titleBottom?: string;
  subtitle?: string;
  ctaLabel?: string;
  crumbs?: string[];
}

const ContactBanner: React.FC<ContactBannerProps> = ({
  titleTop = "Lets Talk",
  subtitle = "Got a question about sizing, an order that's running late, or just want to tell us a fit slapped? Drop it below — a real person reads every message, no bots on tag duty.",
  crumbs = ["Home", "Contact Us"],
}) => {
  return (
    <section className="about-banner">
      <div className="about-banner__crumb">
        {crumbs.map((c, i) => (
          <React.Fragment key={c}>
            {i > 0 && <span className="about-banner__sep">/</span>}
            <span className={i === crumbs.length - 1 ? "is-active" : ""}>
              {c.toUpperCase()}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div className="about-banner__content">
        <h1 className="about-banner__title">
          <span className="line line--accent">{titleTop}</span>
        </h1>
      </div>

      <p className="about-banner__subtitle">{subtitle}</p>

    </section>
  );
};

export default ContactBanner;