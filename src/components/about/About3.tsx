import React from "react";

interface About3Props {
  badge?: string;
  quote?: string;
  name?: string;
  role?: string;
  initials?: string;
  founded?: string;
}

const About3: React.FC<About3Props> = ({
  quote = "We started STYLEVIN with one cutting table and a stubborn belief — that streetwear shouldn't make you choose between quality and price. Every piece we ship still has to pass the same test it did on day one: would I actually wear this on repeat? If the answer's yes, it earns the tag. That's still the only filter we use.",
  name = "John Doe",
  role = "Founder & Creative Lead, Stylevin",
  initials = "JD",
  founded = "Est. 2023",
}) => {
  return (
    <section className="about3">
      <div className="about3__inner">
        <div className="about3__portrait">
          <span className="about3__ring" aria-hidden="true" />
          <span className="about3__avatar">{initials}</span>
          <span className="about3__pin">{founded}</span>
        </div>

        <div className="about3__content">
          <header className="instagram-section__header">
          <span className="instagram-section__eyebrow">Stylevin</span>
          <h2 className="instagram-section__title">From The Founder</h2>
        </header>

          <span className="about3__quote-mark" aria-hidden="true">
            &#8220;
          </span>

          <p className="about3__quote">{quote}</p>

          <div className="about3__meta">
            <span className="about3__signature">{name}</span>
            <span className="about3__role">{role}</span>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default About3;