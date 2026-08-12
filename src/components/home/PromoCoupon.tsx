import React from "react";

interface PromoCouponProps {
  logo: React.ReactNode;
  title: string;
  subtitle?: string;
  tag?: string;
}

export const PromoCoupon: React.FC<PromoCouponProps> = ({
  logo,
  title,
  subtitle,
  tag = "LIMITED",
}) => {
  return (
    <div className="coupon-card d-flex align-items-center">
      <span className="coupon-card__tag">{tag}</span>

      <div className="coupon-card__logo">{logo}</div>

      <div className="coupon-card__divider" />

      <div className="coupon-card__body d-flex flex-column">
        <span className="coupon-card__title">{title}</span>
        {subtitle && <span className="coupon-card__subtitle">{subtitle}</span>}
      </div>

      {/* <span className="coupon-card__arrow">→</span> */}
    </div>
  );
};

const SnapmintLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 14c0-6 4-10 14-10 0 10-4 14-10 14-2.5 0-4-1.8-4-4z"
        fill="var(--color-4)"
      />
      <path
        d="M4 20c2-4 5-7 10-9"
        stroke="var(--color-4)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
    <span
      style={{
        fontFamily: "var(--font-family)",
        fontWeight: 800,
        fontSize: 19,
        color: "var(--color-white)",
      }}
    >
      snapmint
    </span>
  </div>
);

const HdfcBankLogo = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 2,
    }}
  >
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <path d="M2 12V2h10" stroke="var(--color-4)" strokeWidth="4" fill="none" />
      <path d="M38 12V2H28" stroke="var(--color-4)" strokeWidth="4" fill="none" />
      <path d="M2 28v10h10" stroke="var(--color-4)" strokeWidth="4" fill="none" />
      <path d="M38 28v10H28" stroke="var(--color-4)" strokeWidth="4" fill="none" />
      <rect x="15" y="15" width="10" height="10" fill="var(--color-4)" />
    </svg>
    <span
      style={{
        fontFamily: "var(--font-family)",
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: 0.5,
        color: "var(--color-white)",
      }}
    >
      HDFC BANK
    </span>
  </div>
);

const OfferCoupons: React.FC = () => {
  return (
    <section className="promo-section">
      <header className="instagram-section__header">
        <h2 className="instagram-section__title">GRAB THE DEAL</h2>
      </header>

      <div className="coupon-row">
        <PromoCoupon
          logo={<SnapmintLogo />}
          title="Flat 10% cashback up to ₹300"
          subtitle="Pay easy with Snapmint"
          tag="CASHBACK"
        />
        <PromoCoupon
          logo={<HdfcBankLogo />}
          title="Flat ₹150 off with HDFC Bank"
          subtitle="Minimum shopping of ₹1399"
          tag="BANK OFFER"
        />
      </div>
    </section>
  );
};

export default OfferCoupons;