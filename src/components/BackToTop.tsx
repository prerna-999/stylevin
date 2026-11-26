"use client";

import { useEffect, useState, useCallback } from "react";

const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? scrollTop / docHeight : 0;

    setProgress(pct);
    setVisible(scrollTop > 300);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const dashOffset = CIRCUMFERENCE - progress * CIRCUMFERENCE;

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? "is-visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <svg viewBox="0 0 54 54">
        <circle className="ring-bg" cx="27" cy="27" r={RADIUS} />
        <circle
          className="ring-progress"
          cx="27"
          cy="27"
          r={RADIUS}
          style={{
            strokeDasharray: CIRCUMFERENCE,
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>
      <span className="btn-core">
        <svg className="arrow" viewBox="0 0 24 24">
          <path d="M12 19V5" />
          <path d="M6 11l6-6 6 6" />
        </svg>
      </span>
    </button>
  );
}