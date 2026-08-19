import React from "react";

interface PrivacyBannerProps {
  titleTop?: string;
  subtitle?: string;
  crumbs?: string[];
}

const PrivacyBanner: React.FC<PrivacyBannerProps> = ({
  titleTop = "Privacy Policy",
  subtitle = "Your data, your rules. Here's exactly what we collect, why, and how you stay in control of it.",
  crumbs = ["Home", "Privacy Policy"],
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

export default PrivacyBanner;