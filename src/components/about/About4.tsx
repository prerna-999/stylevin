import React from "react";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";

interface TrustItem {
  icon: string;
  label: string;
}

interface About4Props {
  eyebrow?: string;
  titleTop?: string;
  titleBottom?: string;
  subtitle?: string;
  trustItems?: TrustItem[];
}

const About4: React.FC<About4Props> = ({
  eyebrow = "Ready When You Are",
  titleTop = "Stop scrolling.",
  titleBottom = "Start dressing.",
  subtitle = "You've read the story — now go build the fit. New drops land every week, and your size won't wait around.",
}) => {
  return (
    <section className="about4">
      <div className="about4__inner">
        <span className="about4__eyebrow">{eyebrow}</span>
        <h2 className="about4__title">
          <span className="about4__line">{titleTop}</span>
          <span className="about4__line about4__line--accent">
            {titleBottom}
          </span>
        </h2>

        <p className="about4__subtitle">{subtitle}</p>

        <Link href="/" className="stylebtn mt-20">
          <span className="stylebtn__pin" />
          <span className="stylebtn__eyebrow">
            SHOP NEW DROPS
            <span className="stylebtn__arrow" aria-hidden="true">
              <FiArrowRight />
            </span>
          </span>
        </Link>

      </div>
    </section>
  );
};

export default About4;