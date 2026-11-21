import React, { useCallback, useEffect, useRef, useState } from "react";

interface Hotspot {
  top: string;
  left: string; 
}

interface TrendingItem {
  id: string;
  image: string;
  title: string;
  hotspots: Hotspot[];
}

const CDN = "https://cdn.shopify.com/s/files/1/0753/1056/3627/files";

const ITEMS: TrendingItem[] = [
  {
    id: "wz03",
    image: `${CDN}/WZ03_BlueMiraj_0103_S125_JKY_1.webp?width=600&height=800`,
    title: "Blue Mirage Coded",
    hotspots: [{ top: "34%", left: "58%" }],
  },
  {
    id: "mz16",
    image: `${CDN}/MZ16_IPBLACK_0101_S225_JKY_1.webp?width=600&height=800`,
    title: "Stealth Mode",
    hotspots: [{ top: "28%", left: "62%" }, { top: "58%", left: "38%" }],
  },
  {
    id: "wz10",
    image: `${CDN}/WZ10_QUAIL_0101_S225_JKY_1.webp?width=600&height=800`,
    title: "Dried Sage Drift",
    hotspots: [{ top: "32%", left: "55%" }],
  },
  {
    id: "mz34",
    image: `${CDN}/MZ34_IPBUHVN_0101_S126_Jky_1.jpg?width=600&height=800`,
    title: "Heaven Sent Blue",
    hotspots: [{ top: "30%", left: "48%" }],
  },
  {
    id: "wz24",
    image: `${CDN}/WZ24_IPLCSNW_0101_S126_Jky_1.jpg?width=600&height=800`,
    title: "Lilac Snow Fade",
    hotspots: [{ top: "36%", left: "52%" }],
  },
  {
    id: "mz33",
    image: `${CDN}/MZ33_IPBLACK_0101_S126_Jky_01.jpg?width=600&height=800`,
    title: "Midnight Ease",
    hotspots: [{ top: "44%", left: "50%" }],
  },
  {
    id: "wz28",
    image: `${CDN}/WZ28_IPMONRK_0101_S126_Jky_1.jpg?width=600&height=800`,
    title: "Moon Rock Muse",
    hotspots: [{ top: "40%", left: "56%" }],
  },
];

const TrendingNow: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeId, setActiveId] = useState(ITEMS[Math.floor(ITEMS.length / 2)]?.id ?? ITEMS[0].id);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollStartRef = useRef(0);
  const draggedRef = useRef(false);
  const [isPressing, setIsPressing] = useState(false);

  // Figure out which card sits nearest the horizontal center of the
  // track and mark it "active" (enlarged + highlighted).
  const updateActiveCard = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const centerX = trackRect.left + trackRect.width / 2;

    let closestId = activeId;
    let closestDistance = Infinity;

    ITEMS.forEach((item) => {
      const el = cardRefs.current[item.id];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenter - centerX);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestId = item.id;
      }
    });

    setActiveId((prev) => (prev === closestId ? prev : closestId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveCard);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    // Run once on mount so the middle card starts "active"
    updateActiveCard();

    return () => {
      track.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [updateActiveCard]);

  const scrollToCard = useCallback((id: string) => {
    const el = cardRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  const scrollByStep = useCallback(
    (direction: 1 | -1) => {
      const currentIndex = ITEMS.findIndex((item) => item.id === activeId);
      const nextIndex = Math.min(Math.max(currentIndex + direction, 0), ITEMS.length - 1);
      scrollToCard(ITEMS[nextIndex].id);
    },
    [activeId, scrollToCard]
  );

  // Click-and-drag support, same pattern used elsewhere in this build
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    isDraggingRef.current = true;
    setIsPressing(true);
    draggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragScrollStartRef.current = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > 4) draggedRef.current = true;
    track.scrollLeft = dragScrollStartRef.current - delta;
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (track && track.hasPointerCapture(e.pointerId)) {
      track.releasePointerCapture(e.pointerId);
    }
    isDraggingRef.current = false;
    setIsPressing(false);
  }, []);

  const handleTrackClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false;
    }
  }, []);

  return (
    <section className="trending-now" aria-label="Trending now">
      <div className="trending-now__badge" aria-hidden="true">
        <span className="trending-now__badge-pin" />
        <span className="trending-now__badge-eyebrow">Trending</span>
        <span className="trending-now__badge-title">Now</span>
        <span className="trending-now__badge-underline" />
      </div>

      <div className="trending-now__carousel">
        <button
          type="button"
          className="trending-now__nav trending-now__nav--prev"
          aria-label="Previous look"
          onClick={() => scrollByStep(-1)}
        >
          <svg width="9" height="15" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.67071 0.280717C6.09128 -0.0987274 6.75961 -0.0924762 7.17346 0.29324C7.58597 0.680185 7.59269 1.30507 7.18686 1.6983L2.58617 5.99862L7.18549 10.2989H7.18683C7.39308 10.4855 7.51095 10.7423 7.51363 11.0115C7.5163 11.2795 7.40246 11.5387 7.20022 11.7291C6.99664 11.9182 6.71941 12.0246 6.43276 12.0221C6.1448 12.0196 5.87024 11.9094 5.67066 11.7166L0.313247 6.70742C-0.104648 6.31544 -0.104648 5.6818 0.313247 5.28982L5.67071 0.280717Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <div
          className={`trending-now__track${isPressing ? " trending-now__track--dragging" : ""}`}
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={handleTrackClickCapture}
        >
          {ITEMS.map((item) => {
            const isActive = item.id === activeId;
            return (
              <div
                key={item.id}
                ref={(el) => {
                  cardRefs.current[item.id] = el;
                }}
                className={`trending-card${isActive ? " trending-card--active" : ""}`}
              >
                <div className="trending-card__media">
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" draggable={false} />

                  {item.hotspots.map((spot, i) => (
                    <span
                      key={i}
                      className="trending-card__hotspot"
                      style={{ top: spot.top, left: spot.left }}
                      aria-hidden="true"
                    >
                      <span className="trending-card__hotspot-dot" />
                    </span>
                  ))}

                  <span className="trending-card__label">{item.title}</span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="trending-now__nav trending-now__nav--next"
          aria-label="Next look"
          onClick={() => scrollByStep(1)}
        >
          <svg width="9" height="15" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.84296 11.7408C1.42239 12.1202 0.754058 12.114 0.340209 11.7282C-0.0723028 11.3413 -0.079023 10.7164 0.326816 10.3232L4.9275 6.02286L0.328187 1.72254L0.326848 1.72254C0.120588 1.53595 0.00272502 1.27923 4.71953e-05 1.00997C-0.00263166 0.741982 0.111215 0.482771 0.313456 0.292408C0.517037 0.103314 0.794267 -0.0031337 1.08091 -0.00062647C1.36887 0.0018779 1.64343 0.11208 1.84302 0.304931L7.20043 5.31407C7.61832 5.70605 7.61832 6.33968 7.20043 6.73166L1.84296 11.7408Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <div className="trending-now__pagination" role="tablist" aria-label="Trending look selector">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === activeId}
            aria-label={`Show ${item.title}`}
            className={`trending-now__dot${item.id === activeId ? " trending-now__dot--active" : ""}`}
            onClick={() => scrollToCard(item.id)}
          />
        ))}
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

export default TrendingNow;