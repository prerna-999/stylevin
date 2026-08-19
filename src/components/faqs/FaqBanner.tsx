import React from "react";

interface FaqBannerProps {
  titleTop?: string;
  titleBottom?: string;
  subtitle?: string;
  ctaLabel?: string;
  crumbs?: string[];
}

const FaqBanner: React.FC<FaqBannerProps> = ({
  titleTop = "FAQs",
  subtitle = "Got questions? We've got answers. Everything you need to know about orders, shipping, returns, and more — all in one place.",
  ctaLabel = "VIEW FAQS",
  crumbs = ["Home", "FAQs"],
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

export default FaqBanner;