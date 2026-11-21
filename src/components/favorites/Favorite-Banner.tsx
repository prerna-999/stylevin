import React from "react";

interface FavBannerProps {
  titleTop?: string;
  titleBottom?: string;
  subtitle?: string;
  ctaLabel?: string;
  crumbs?: string[];
}

const FavBanner: React.FC<FavBannerProps> = ({
  titleTop = "Favorites",
  subtitle = "The pieces you've saved, all in one place. Pick up where you left off, or send them to your cart.",
  ctaLabel = "SHOP NOW",
  crumbs = ["Home", "Favorites"],
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

export default FavBanner;