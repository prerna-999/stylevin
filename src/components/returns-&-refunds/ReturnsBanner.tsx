import React from "react";

interface ReturnsBannerProps {
  titleTop?: string;
  subtitle?: string;
  crumbs?: string[];
}

const ReturnsBanner: React.FC<ReturnsBannerProps> = ({
  titleTop = "Returns & Refunds",
  subtitle = "From our warehouse to your door — here's exactly how, when, and what it costs.",
  crumbs = ["Home", "Returns & Refunds"],
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

export default ReturnsBanner;