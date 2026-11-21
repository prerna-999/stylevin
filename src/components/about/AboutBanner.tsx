import React from "react";

interface AboutBannerProps {
  titleTop?: string;
  titleBottom?: string;
  subtitle?: string;
  ctaLabel?: string;
  crumbs?: string[];
}

const AboutBanner: React.FC<AboutBannerProps> = ({
  titleTop = "Our Story",
  subtitle = "Not a trend to chase — a way of dressing. Since day one we've built pieces for people who show up, stay curious, and never sit still.",
  ctaLabel = "OUR STORY",
  crumbs = ["Home", "About Us"],
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

export default AboutBanner;