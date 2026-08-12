"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Container } from "react-bootstrap"; // your existing site container

// ------------------------------------------------------------------
// 1. CONTENT DATA
// ------------------------------------------------------------------
export interface ComboOffer {
  id: number;
  title: string;
  price: string;
  oldPrice?: string;
  image: string; // Shopify CDN URL
  alt: string;
  href: string; // product / buy link
}

const comboOffers: ComboOffer[] = [
  {
    id: 1,
    title: "Tee + Cargo Combo",
    price: "₹1,999",
    oldPrice: "₹2,798",
    image: "/assets/img/all-images/home/combo1.webp",
    alt: "Oversized tee and cargo pants combo",
    href: "/products/tee-cargo-combo",
  },
  {
    id: 2,
    title: "Hoodie + Joggers",
    price: "₹2,499",
    oldPrice: "₹3,398",
    image: "/assets/img/all-images/home/combo2.webp",
    alt: "Hoodie and joggers combo",
    href: "/products/hoodie-joggers-combo",
  },
  {
    id: 3,
    title: "Graphic Duo",
    price: "₹1,499",
    oldPrice: "₹1,998",
    image: "/assets/img/all-images/home/combo3.webp",
    alt: "Two graphic printed tees combo",
    href: "/products/graphic-duo-combo",
  },
  {
    id: 4,
    title: "Cap + Tee Combo",
    price: "₹1,299",
    oldPrice: "₹1,698",
    image: "/assets/img/all-images/home/combo1.webp",
    alt: "Cap and tee combo",
    href: "/products/cap-tee-combo",
  },
  {
    id: 5,
    title: "Shirt + Trouser",
    price: "₹2,199",
    oldPrice: "₹2,998",
    image: "/assets/img/all-images/home/combo2.webp",
    alt: "Shirt and trouser combo",
    href: "/products/shirt-trouser-combo",
  },
  {
    id: 6,
    title: "Shirt + Trouser",
    price: "₹2,199",
    oldPrice: "₹2,998",
    image: "/assets/img/all-images/home/combo3.webp",
    alt: "Shirt and trouser combo",
    href: "/products/shirt-trouser-combo",
  },
  {
    id: 7,
    title: "Shirt + Trouser",
    price: "₹2,199",
    oldPrice: "₹2,998",
    image: "/assets/img/all-images/home/combo1.webp",
    alt: "Shirt and trouser combo",
    href: "/products/shirt-trouser-combo",
  },
  {
    id: 8,
    title: "Shirt + Trouser",
    price: "₹2,199",
    oldPrice: "₹2,998",
    image: "/assets/img/all-images/home/combo2.webp",
    alt: "Shirt and trouser combo",
    href: "/products/shirt-trouser-combo",
  },
];

const getDiscount = (price: string, oldPrice?: string) => {
  if (!oldPrice) return null;
  const num = (s: string) => Number(s.replace(/[^0-9]/g, ""));
  const p = num(price);
  const o = num(oldPrice);
  if (!o) return null;
  return Math.round(((o - p) / o) * 100);
};

// ------------------------------------------------------------------
// 2. COMPONENT — horizontal scroll-snap carousel, mapped from data above
//    Desktop: 3 full + peek | Tablet: 2 visible | Mobile: 1 visible
//    Includes click-and-drag support (same pattern as NewDrop)
// ------------------------------------------------------------------
export default function ComboOffers() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPressing, setIsPressing] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollStartRef = useRef(0);
  const draggedRef = useRef(false);

  const scrollByCard = useCallback((direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".combo-slide");
    const cardWidth = card ? card.offsetWidth + 20 : track.offsetWidth;
    track.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  }, []);

  // Click-and-drag support so people can slide the row directly with a
  // mouse (touch/trackpad already scroll natively via overflow-x: auto).
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

  // Prevent the "Buy Now" link from firing right after a drag
  const handleTrackClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false;
    }
  }, []);

  return (
    <section className="combo-section" aria-labelledby="combo-heading">
      <div className="combo-curve" aria-hidden="true" />

      <Container>
        <div className="combo-heading-wrap">
          <h2 className="combo-heading" id="combo-heading">
            COMBO OFFERS
          </h2>
        </div>

        <div className="combo-carousel">
          <button
            type="button"
            className="combo-offers-nav combo-offers-nav--prev"
            onClick={() => scrollByCard("left")}
            aria-label="Previous combo"
          >
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.84296 11.7408C1.42239 12.1202 0.754058 12.114 0.340209 11.7282C-0.0723028 11.3413 -0.079023 10.7164 0.326816 10.3232L4.9275 6.02286L0.328187 1.72254L0.326848 1.72254C0.120588 1.53595 0.00272502 1.27923 4.71953e-05 1.00997C-0.00263166 0.741982 0.111215 0.482771 0.313456 0.292408C0.517037 0.103314 0.794267 -0.0031337 1.08091 -0.00062647C1.36887 0.0018779 1.64343 0.11208 1.84302 0.304931L7.20043 5.31407C7.61832 5.70605 7.61832 6.33968 7.20043 6.73166L1.84296 11.7408Z" fill="currentColor" />
            </svg>
          </button>

          <div className="combo-track-wrap">
            <div
              className={`combo-track${isPressing ? " combo-track--dragging" : ""}`}
              ref={trackRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
              onPointerCancel={endDrag}
              onClickCapture={handleTrackClickCapture}
            >
              {comboOffers.map((combo) => {
                const discount = getDiscount(combo.price, combo.oldPrice);
                return (
                  <article key={combo.id} className="combo-slide">
                    <div className="combo-card">
                      {discount ? (
                        <span className="combo-badge">{discount}% OFF</span>
                      ) : null}

                      <div className="combo-image-wrap">
                        <Image
                          src={combo.image}
                          alt={combo.alt}
                          fill
                          sizes="(max-width: 480px) 90vw,
                                 (max-width: 768px) 45vw,
                                 (max-width: 1200px) 30vw,
                                 320px"
                          className="combo-image"
                          priority={false}
                          draggable={false}
                        />
                      </div>

                      <div className="combo-info">
                        <p className="combo-title">{combo.title}</p>

                        <div className="combo-bottom-row">
                          <div className="combo-price-block">
                            <span className="combo-price">{combo.price}</span>
                            {combo.oldPrice && (
                              <span className="combo-old-price">{combo.oldPrice}</span>
                            )}
                          </div>

                          <a href={combo.href} className="combo-buy-btn">
                            Buy Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="combo-offers-nav combo-offers-nav--next"
            onClick={() => scrollByCard("right")}
            aria-label="Next combo"
          >
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.84296 11.7408C1.42239 12.1202 0.754058 12.114 0.340209 11.7282C-0.0723028 11.3413 -0.079023 10.7164 0.326816 10.3232L4.9275 6.02286L0.328187 1.72254L0.326848 1.72254C0.120588 1.53595 0.00272502 1.27923 4.71953e-05 1.00997C-0.00263166 0.741982 0.111215 0.482771 0.313456 0.292408C0.517037 0.103314 0.794267 -0.0031337 1.08091 -0.00062647C1.36887 0.0018779 1.64343 0.11208 1.84302 0.304931L7.20043 5.31407C7.61832 5.70605 7.61832 6.33968 7.20043 6.73166L1.84296 11.7408Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </Container>
    </section>
  );
}
