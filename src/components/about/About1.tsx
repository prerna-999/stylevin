import React from "react";

interface Feature {
  emoji: string;
  title: string;
  text: string;
}

interface About1Props {
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  {
    emoji: "⚡",
    title: "Drops That Slap",
    text: "New fits every week — not once-a-season leftovers.",
  },
  {
    emoji: "🎯",
    title: "Fit For Every Vibe",
    text: "Oversized, cropped, boxy, slim — pick your lane.",
  },
  {
    emoji: "🚚",
    title: "Fast, No Cap",
    text: "Ordered today, on your doorstep before the hype dies.",
  },
  {
    emoji: "🔁",
    title: "Easy Returns",
    text: "Didn't hit right? Swap it, no awkward questions.",
  },
];

const About1: React.FC<About1Props> = ({ features = defaultFeatures }) => {
  return (
    <section className="about1">
      <div className="about1__inner">
        <div className="trending-now__badge" aria-hidden="true">
        <span className="trending-now__badge-pin" />
        <span className="trending-now__badge-eyebrow">We Are Your Favourite </span>
        <span className="trending-now__badge-title"> Online Store</span>
        <span className="trending-now__badge-underline" />
      </div>

        <div className="about1__features">
          {features.map((f, i) => (
            <div className="about1__feature" key={f.title}>
              <span className="about1__feature-no">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="about1__feature-emoji">{f.emoji}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <span className="about1__feature-line" />
            </div>
          ))}
        </div>
      </div>

       <div className="trending-now__curve" aria-hidden="true">
        <svg
          className="trending-now__curve-svg"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,70 C280,10 480,130 760,90 C1040,50 1200,120 1440,60 L1440,140 L0,140 Z"
            fill="var(--color-2)"
          />
        </svg>
      </div>

    
    </section>
  );
};

export default About1;