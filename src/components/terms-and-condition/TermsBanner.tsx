import React from "react";

interface TermsBannerProps {
  titleTop?: string;
  subtitle?: string;
  crumbs?: string[];
}

const TermsBanner: React.FC<TermsBannerProps> = ({
  titleTop = "Terms & Conditions",
  subtitle = "The fine print — read once, shop worry-free every time after.",
  crumbs = ["Home", "Terms & Conditions"],
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

export default TermsBanner;