import { Container } from "react-bootstrap";
import {
  Truck,
  PackageCheck,
  BadgeCheck,
  Tags,
  LucideIcon,
} from "lucide-react";


type Feature = {
  icon: LucideIcon;
  code: string;
  title: string;
  sub: string;
};

const FEATURES: Feature[] = [
  {
    icon: Truck,
    code: "SHIP / 01",
    title: "Free Shipping",
    sub: "Pan-India, in 3–5 days",
  },
  {
    icon: PackageCheck,
    code: "RTRN / 02",
    title: "Easy Returns",
    sub: "7-day exchange window",
  },
  {
    icon: BadgeCheck,
    code: "AUTH / 03",
    title: "100% Authentic",
    sub: "Verified brand partners",
  },
  {
    icon: Tags,
    code: "PRICE / 04",
    title: "Best Prices",
    sub: "New deals, every week",
  },
];

export default function FeatureStrip() {
  return (
    <section className="feature-strip">
      <Container>
         <h2 className="new-drop__title">Every Order, Tagged Guaranteed</h2>
        <div className="tag-rack">
          <div className="tag-rack__rail" />

          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            const tilt = idx % 2 === 0 ? "tag-card--a" : "tag-card--b";
            return (
              <div className={`tag-card ${tilt}`} key={feature.code}>
                <div className="tag-card__string" />
                <div className="tag-card__grommet" />

                <span className="tag-card__code">{feature.code}</span>

                <div className="tag-card__icon-wrap">
                  <Icon className="feature-icon" strokeWidth={1.8} />
                </div>

                <h4 className="tag-card__title">{feature.title}</h4>
                <p className="tag-card__sub">{feature.sub}</p>

                <div className="tag-card__perf" />
                <div className="tag-card__barcode" />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}