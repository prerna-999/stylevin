import React, { useCallback, useEffect, useRef, useState } from "react";

interface HeroSlide {
  id: string;
  href: string;
  desktopImg: string;
  mobileImg: string;
  alt: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: "men",
    href: "/collections/groove-men",
    desktopImg: "/assets/img/all-images/home/Hero_banners-01.webp",
    mobileImg: "/assets/img/all-images/home/Hero_banners-01.webp",
    alt: "Always in it - Men's collection",
  },
  {
    id: "women",
    href: "/collections/groove-women",
    desktopImg: "/assets/img/all-images/home/Hero_banners-02.jfif",
    mobileImg: "/assets/img/all-images/home/Hero_banners-02.jfif",
    alt: "Always in it - Women's collection",
  },
  {
    id: "groove",
    href: "/collections/groove",
    desktopImg: "/assets/img/all-images/home/Hero_banners-03.jfif",
    mobileImg: "/assets/img/all-images/home/Hero_banners-03.jfif",
    alt: "Always in it - Groove collection",
  },
];

const AUTOPLAY_DELAY = 2000;

const HeroHome: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const bulletRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pillRef = useRef<HTMLSpanElement | null>(null);

  const total = SLIDES.length;

  const goTo = useCallback(
    (index: number) => {
      const next = (index + total) % total;
      setActiveIndex(next);
    },
    [total]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const startAutoplay = () => {
      if (hasInteracted) return;
      setHasInteracted(true);
    };

    window.addEventListener("scroll", startAutoplay, { passive: true });
    window.addEventListener("mousemove", startAutoplay);
    window.addEventListener("click", startAutoplay);
    window.addEventListener("touchstart", startAutoplay, { passive: true });

    return () => {
      window.removeEventListener("scroll", startAutoplay);
      window.removeEventListener("mousemove", startAutoplay);
      window.removeEventListener("click", startAutoplay);
      window.removeEventListener("touchstart", startAutoplay);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (!hasInteracted) return;

    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, AUTOPLAY_DELAY);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [hasInteracted, total]);

  const pauseAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  const resumeAutoplay = () => {
    if (!hasInteracted) return;
    pauseAutoplay();
    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, AUTOPLAY_DELAY);
  };

  // Move the pagination "pill" to sit under the active bullet
  useEffect(() => {
    const activeBullet = bulletRefs.current[activeIndex];
    const pill = pillRef.current;
    if (activeBullet && pill) {
      pill.style.left = `${activeBullet.offsetLeft}px`;
      pill.style.width = `${activeBullet.offsetWidth}px`;
    }
  }, [activeIndex]);

  return (
    <section className="hero-home" aria-label="Homepage hero banner">
      <div
        className="hero-home__swiper"
        onMouseEnter={pauseAutoplay}
        onMouseLeave={resumeAutoplay}
      >
        <div
          className="hero-home__wrapper"
          ref={trackRef}
          style={{
            transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
          }}
        >
          {SLIDES.map((slide, index) => (
            <div
              className="hero-home__slide"
              key={slide.id}
              role="group"
              aria-label={`${index + 1} / ${total}`}
              aria-hidden={activeIndex !== index}
            >
              <a href={slide.href} className="hero-home__btn">
                <picture>
                  <source media="(max-width: 768px)" srcSet={slide.mobileImg} />
                  <source media="(min-width: 769px)" srcSet={slide.desktopImg} />
                  <img
                    src={slide.desktopImg}
                    alt={slide.alt}
                    width={1440}
                    height={677}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                </picture>
              </a>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="hero-home__pagination">
          {SLIDES.map((slide, index) => (
            <span
              key={slide.id}
              ref={(el) => {
                bulletRefs.current[index] = el;
              }}
              className={`hero-home__bullet${
                index === activeIndex ? " hero-home__bullet--active" : ""
              }`}
              role="button"
              tabIndex={0}
              aria-current={index === activeIndex}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                setHasInteracted(true);
                goTo(index);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setHasInteracted(true);
                  goTo(index);
                }
              }}
            />
          ))}
          <span className="hero-home__bullet-slider" ref={pillRef} aria-hidden="true" />
        </div>

        {/* Arrows + counter */}
        <div className="hero-home__arrows">
          <button
            type="button"
            className="hero-home__nav hero-home__nav--prev"
            aria-label="Previous slide"
            onClick={() => {
              setHasInteracted(true);
              goPrev();
            }}
          >
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.67071 0.280717C6.09128 -0.0987274 6.75961 -0.0924762 7.17346 0.29324C7.58597 0.680185 7.59269 1.30507 7.18686 1.6983L2.58617 5.99862L7.18549 10.2989H7.18683C7.39308 10.4855 7.51095 10.7423 7.51363 11.0115C7.5163 11.2795 7.40246 11.5387 7.20022 11.7291C6.99664 11.9182 6.71941 12.0246 6.43276 12.0221C6.1448 12.0196 5.87024 11.9094 5.67066 11.7166L0.313247 6.70742C-0.104648 6.31544 -0.104648 5.6818 0.313247 5.28982L5.67071 0.280717Z"
                fill="white"
              />
            </svg>
          </button>

          <button
            type="button"
            className="hero-home__nav hero-home__nav--next"
            aria-label="Next slide"
            onClick={() => {
              setHasInteracted(true);
              goNext();
            }}
          >
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.84296 11.7408C1.42239 12.1202 0.754058 12.114 0.340209 11.7282C-0.0723028 11.3413 -0.079023 10.7164 0.326816 10.3232L4.9275 6.02286L0.328187 1.72254L0.326848 1.72254C0.120588 1.53595 0.00272502 1.27923 4.71953e-05 1.00997C-0.00263166 0.741982 0.111215 0.482771 0.313456 0.292408C0.517037 0.103314 0.794267 -0.0031337 1.08091 -0.00062647C1.36887 0.0018779 1.64343 0.11208 1.84302 0.304931L7.20043 5.31407C7.61832 5.70605 7.61832 6.33968 7.20043 6.73166L1.84296 11.7408Z"
                fill="white"
              />
            </svg>
          </button>

          {/* Slide counter — "02 / 03" */}
          <div className="hero-home__counter" aria-live="polite">
            <span className="hero-home__counter-current">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="hero-home__counter-divider">/</span>
            <span className="hero-home__counter-total">
              {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Bottom curve overlay — inline SVG painted in the color of the
            section below, so it always renders (no external image to 404)
            and stays fully inside this component's own box (no clipping
            issues from a neighboring section's overflow:hidden). */}
        <div className="hero-home__curve" aria-hidden="true">
          <svg
            className="hero-home__curve-svg"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,70 C280,130 480,10 760,50 C1040,90 1200,20 1440,60 L1440,200 L0,200 Z"
              fill="var(--primary-color)"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;