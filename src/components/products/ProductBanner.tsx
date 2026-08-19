import React from "react";

interface ProductBannerProps {
  title: string;
  subtitle?: string;
  crumbs: string[];
}

const ProductBanner: React.FC<ProductBannerProps> = ({
  title,
  subtitle = "Shop the full collection — new drops added every week.",
  crumbs,
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
          <span className="line line--accent">{title}</span>
        </h1>
      </div>

      <p className="about-banner__subtitle">{subtitle}</p>
    </section>
  );
};

export default ProductBanner;