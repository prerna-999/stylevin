import React from "react";

interface About2Props {
  marqueeText?: string;
  eyebrow?: string;
}

const About2: React.FC<About2Props> = ({
  marqueeText = "STYLEVIN — ALWAYS IN IT — DESIGNED, CUT, STITCHED, SHIPPED —",
}) => {
  return (
    <section className="about2">
          <h2 className="new-drop__title">Our Manifesto</h2>

      {/* <div className="about2__marquee" aria-hidden="true">
        <div className="about2__marquee-track">
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div> */}

      <div className="about2__inner">
        <p className="about2__statement">
          We don't design for a season, we design for{" "}
          <em>how you actually live</em> in your clothes. No filler fabric,
          no rushed stitching, no drop you'll forget by next month.{" "}
          <em>Every piece earns its place</em> on the rack — worn hard,
          washed often, still holding its shape. That's the only metric
          that's ever mattered to us:{" "}
          <em>would we still wear it a year from now?</em>
        </p>
      </div>

      {/* <div className="about2__marquee about2__marquee--reverse" aria-hidden="true">
        <div className="about2__marquee-track about2__marquee-track--reverse">
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div> */}

      
    </section>
    
  );
};

export default About2;