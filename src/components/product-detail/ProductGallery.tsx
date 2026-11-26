import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiMaximize2,
  FiX,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";
import { useWishlist } from "@/context/WishlistContext";

interface ProductGalleryProps {
  productId: number;
  images: string[];
  name: string;
  discount?: number;
}

/** Shopify CDN images accept width/height params — ask for a bigger file for zoom. */
const hiRes = (src: string) => {
  if (!src.includes("cdn.shopify.com")) return src;
  try {
    const url = new URL(src);
    url.searchParams.set("width", "1200");
    url.searchParams.set("height", "1560");
    return url.toString();
  } catch {
    return src;
  }
};

const ProductGallery: React.FC<ProductGalleryProps> = ({
  productId,
  images,
  name,
  discount = 0,
}) => {
  const { has, toggle } = useWishlist();
  const wished = has(productId);

  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [lbZoom, setLbZoom] = useState(false);
  const [lbOrigin, setLbOrigin] = useState({ x: 50, y: 50 });
  const touchStartX = useRef<number | null>(null);

  const total = images.length;
  const hasMany = total > 1;

  const go = useCallback(
    (dir: 1 | -1) => {
      setActive((i) => (i + dir + total) % total);
      setLbZoom(false);
    },
    [total]
  );

  // reset when the product changes (client-side navigation between products)
  useEffect(() => {
    setActive(0);
    setLightbox(false);
  }, [productId]);

  // lightbox: keyboard + body scroll lock
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight" && hasMany) go(1);
      if (e.key === "ArrowLeft" && hasMany) go(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, hasMany, go]);

  /* ---------- hover zoom (desktop / mouse only) ---------- */
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  /* ---------- swipe (touch) ---------- */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !hasMany) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const openLightbox = () => {
    setLbZoom(false);
    setLightbox(true);
  };

  const toggleLbZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setLbOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    setLbZoom((z) => !z);
  };

  const moveLbZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!lbZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setLbOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className={`pd-gallery ${hasMany ? "pd-gallery--multi" : ""}`}>
      {hasMany && (
        <div className="pd-gallery__thumbs" role="tablist" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`View image ${i + 1}`}
              className={`pd-gallery__thumb ${i === active ? "is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              <Image src={img} alt="" fill sizes="80px" />
            </button>
          ))}
        </div>
      )}

      <div className="pd-gallery__stage">
        <div
          className={`pd-gallery__main ${zoom ? "is-zooming" : ""}`}
          onMouseMove={handleMove}
          onMouseLeave={() => setZoom(null)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={openLightbox}
          role="button"
          tabIndex={0}
          aria-label="Open full-screen image"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openLightbox();
            }
          }}
        >
          <Image
            key={images[active]}
            src={hiRes(images[active])}
            alt={`${name} — image ${active + 1} of ${total}`}
            fill
            priority={active === 0}
            sizes="(max-width: 768px) 100vw, 700px"
            className="pd-gallery__img"
            style={
              zoom
                ? { transformOrigin: `${zoom.x}% ${zoom.y}%` }
                : undefined
            }
          />

          {discount > 0 && (
            <span className="pd-gallery__badge">{discount}% OFF</span>
          )}

          <span className="pd-gallery__hint" aria-hidden="true">
            <FiZoomIn /> Hover to zoom · Click to expand
          </span>
        </div>

        <button
          type="button"
          className={`pd-gallery__wish ${wished ? "is-active" : ""}`}
          aria-label={wished ? "Remove from saved items" : "Save for later"}
          aria-pressed={wished}
          onClick={() => toggle(productId)}
        >
          <FiHeart />
        </button>

        <button
          type="button"
          className="pd-gallery__expand"
          aria-label="Open full-screen image"
          onClick={openLightbox}
        >
          <FiMaximize2 />
        </button>

        {hasMany && (
          <>
            <button
              type="button"
              className="pd-gallery__arrow pd-gallery__arrow--prev"
              aria-label="Previous image"
              onClick={() => go(-1)}
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              className="pd-gallery__arrow pd-gallery__arrow--next"
              aria-label="Next image"
              onClick={() => go(1)}
            >
              <FiChevronRight />
            </button>
            <div className="pd-gallery__dots" aria-hidden="true">
              {images.map((img, i) => (
                <span
                  key={img + i}
                  className={`pd-gallery__dot ${i === active ? "is-active" : ""}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ---------- full-screen lightbox ---------- */}
      {lightbox &&
        createPortal(
        <div
          className="pd-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} images`}
          onClick={() => setLightbox(false)}
        >
          <div className="pd-lightbox__bar" onClick={(e) => e.stopPropagation()}>
            <span className="pd-lightbox__count">
              {active + 1} / {total}
            </span>
            <div className="pd-lightbox__tools">
              <button
                type="button"
                aria-label={lbZoom ? "Zoom out" : "Zoom in"}
                onClick={() => setLbZoom((z) => !z)}
              >
                {lbZoom ? <FiZoomOut /> : <FiZoomIn />}
              </button>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setLightbox(false)}
              >
                <FiX />
              </button>
            </div>
          </div>

          <div
            className={`pd-lightbox__stage ${lbZoom ? "is-zoomed" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleLbZoom(e);
            }}
            onMouseMove={moveLbZoom}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              key={`lb-${images[active]}`}
              src={hiRes(images[active])}
              alt={`${name} — image ${active + 1} of ${total}`}
              fill
              sizes="100vw"
              className="pd-lightbox__img"
              style={{ transformOrigin: `${lbOrigin.x}% ${lbOrigin.y}%` }}
            />
          </div>

          {hasMany && (
            <>
              <button
                type="button"
                className="pd-lightbox__arrow pd-lightbox__arrow--prev"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
              >
                <FiChevronLeft />
              </button>
              <button
                type="button"
                className="pd-lightbox__arrow pd-lightbox__arrow--next"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
              >
                <FiChevronRight />
              </button>
              <div className="pd-lightbox__thumbs" onClick={(e) => e.stopPropagation()}>
                {images.map((img, i) => (
                  <button
                    key={`lbt-${img}-${i}`}
                    type="button"
                    aria-label={`View image ${i + 1}`}
                    className={`pd-lightbox__thumb ${i === active ? "is-active" : ""}`}
                    onClick={() => {
                      setActive(i);
                      setLbZoom(false);
                    }}
                  >
                    <Image src={img} alt="" fill sizes="64px" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProductGallery;
