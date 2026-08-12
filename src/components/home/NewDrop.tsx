import React, { useCallback, useMemo, useRef, useState } from "react";

interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  image: string;
  colorSwatches: string[]; 
  colorCount: number;
}


const CDN = "https://cdn.shopify.com/s/files/1/0753/1056/3627/files";

const MEN_PRODUCTS: Product[] = [
  {
    id: "mz28",
    code: "#MZ28",
    name: "Super Combed Cotton Rich Graphic Printed T-Shirt - Egret",
    price: 999,
    image: `${CDN}/MZ28_IPEGRET_0101_S126_Jky_01.jpg?width=500&height=650`,
    colorSwatches: ["#e8e2d6", "#301311"],
    colorCount: 2,
  },
  {
    id: "mz35-monrk",
    code: "#MZ35",
    name: "Microfiber Fabric Oversized Cargo Utility Pants - Moon Rock",
    price: 2299,
    image: `${CDN}/MZ35_IPMONRK_0101_S126_Jky_1.jpg?width=500&height=650`,
    colorSwatches: ["#8a8478", "#301311"],
    colorCount: 2,
  },
  {
    id: "mz31",
    code: "#MZ31",
    name: "Lightweight Microfiber Fabric Oversized Graphic Printed T-Shirt - Black",
    price: 999,
    image: `${CDN}/MZ31_IPBLACK_0101_S126_Jky_01.jpg?width=500&height=650`,
    colorSwatches: ["#111111", "#8a8478"],
    colorCount: 2,
  },
  {
    id: "mz16",
    code: "#MZ16",
    name: "Microfiber Cotton Blend Elastane Stretch Hoodie Sweatshirt - Black",
    price: 2599,
    image: `${CDN}/MZ16_IPBLACK_0101_S225_JKY_1.webp?width=500&height=650`,
    colorSwatches: ["#111111", "#4a3f35"],
    colorCount: 2,
  },
  {
    id: "mz34",
    code: "#MZ34",
    name: "Super Combed Cotton Rich Mesh Fabric Oversized Polo T-Shirt - Blue Heaven",
    price: 1299,
    image: `${CDN}/MZ34_IPBUHVN_0101_S126_Jky_1.jpg?width=500&height=650`,
    colorSwatches: ["#7fa8c9", "#301311"],
    colorCount: 2,
  },
  {
    id: "mz33",
    code: "#MZ33",
    name: "Microfiber Fabric Regular Fit Shorts with Side Pockets - Black",
    price: 1399,
    image: `${CDN}/MZ33_IPBLACK_0101_S126_Jky_01.jpg?width=500&height=650`,
    colorSwatches: ["#111111", "#755b0b"],
    colorCount: 2,
  },
];

const WOMEN_PRODUCTS: Product[] = [
  {
    id: "wz03",
    code: "#WZ03",
    name: "Super Combed Cotton Rich Elastane Stretch Oversized Boxy Fit Crop Top - Blue Mirage",
    price: 699,
    image: `${CDN}/WZ03_BlueMiraj_0103_S125_JKY_1.webp?width=500&height=650`,
    colorSwatches: ["#6f8fa8", "#301311"],
    colorCount: 2,
  },
  {
    id: "wz09-dkhak",
    code: "#WZ09",
    name: "Super Combed Cotton Regular Fit Hybrid Pants - Dark Khaki",
    price: 1299,
    image: `${CDN}/WZ09_DKHAK_0103_S125_JKY_1.webp?width=500&height=650`,
    colorSwatches: ["#6e6248", "#111111"],
    colorCount: 2,
  },
  {
    id: "wz10",
    code: "#WZ10",
    name: "Super Combed Cotton Rich French Terry Oversized Sleeves Hoodie - Quail",
    price: 1399,
    image: `${CDN}/WZ10_QUAIL_0101_S225_JKY_1.webp?width=500&height=650`,
    colorSwatches: ["#c9b79c", "#4a3f35"],
    colorCount: 2,
  },
  {
    id: "wz24",
    code: "#WZ24",
    name: "Super Combed Cotton Elastane Stretch Slim Fit Racerback Tank Top - Lilac Snow",
    price: 999,
    image: `${CDN}/WZ24_IPLCSNW_0101_S126_Jky_1.jpg?width=500&height=650`,
    colorSwatches: ["#c9b9d9", "#301311"],
    colorCount: 2,
  },
  {
    id: "wz28",
    code: "#WZ28",
    name: "Microfiber Fabric Skort with Side Zipper Pockets - Moon Rock",
    price: 1199,
    image: `${CDN}/WZ28_IPMONRK_0101_S126_Jky_1.jpg?width=500&height=650`,
    colorSwatches: ["#8a8478", "#111111"],
    colorCount: 2,
  },
  {
    id: "wz26",
    code: "#WZ26",
    name: "Super Combed Cotton Rich Oversized Graphic Print T-Shirt - Egret",
    price: 1099,
    image: `${CDN}/WZ26_IPEGRET_0101_S126_Jky_1.jpg?width=500&height=650`,
    colorSwatches: ["#e8e2d6", "#755b0b"],
    colorCount: 2,
  },
];

const formatPrice = (value: number) =>
  `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const NewDrop: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"men" | "women">("men");
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());
  const [isPressing, setIsPressing] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollStartRef = useRef(0);
  const draggedRef = useRef(false);

  const products = useMemo(
    () => (activeTab === "men" ? MEN_PRODUCTS : WOMEN_PRODUCTS),
    [activeTab]
  );

  const scrollByStep = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    // scroll by roughly one card + gap, using the first card's actual
    // width so it stays correct across the desktop/tablet/mobile card sizes
    const firstCard = track.querySelector<HTMLElement>(".new-drop-card");
    const step = firstCard ? firstCard.offsetWidth + 20 : 320;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
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

  // Prevent the wishlist/add-to-bag buttons from firing right after a drag
  const handleTrackClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false;
    }
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="new-drop" aria-label="New drop products">
      <div className="new-drop__curve" aria-hidden="true">
        <svg
          className="new-drop__curve-svg"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 L1440,0 L1440,55 C1180,130 980,10 720,55 C460,100 260,15 0,65 Z"
            fill="var(--primary-color)"
          />
        </svg>
      </div>

      <div className="new-drop__inner">
        <h2 className="new-drop__title">New Drop</h2>

        <div className="new-drop__tabs" role="tablist" aria-label="Shop by gender">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "men"}
            className={`new-drop__tab${activeTab === "men" ? " new-drop__tab--active" : ""}`}
            onClick={() => setActiveTab("men")}
          >
            Men
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "women"}
            className={`new-drop__tab${activeTab === "women" ? " new-drop__tab--active" : ""}`}
            onClick={() => setActiveTab("women")}
          >
            Women
          </button>
        </div>

        <div className="new-drop__carousel">
          <button
            type="button"
            className="new-drop__nav new-drop__nav--prev"
            aria-label="Previous products"
            onClick={() => scrollByStep(-1)}
          >
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.67071 0.280717C6.09128 -0.0987274 6.75961 -0.0924762 7.17346 0.29324C7.58597 0.680185 7.59269 1.30507 7.18686 1.6983L2.58617 5.99862L7.18549 10.2989H7.18683C7.39308 10.4855 7.51095 10.7423 7.51363 11.0115C7.5163 11.2795 7.40246 11.5387 7.20022 11.7291C6.99664 11.9182 6.71941 12.0246 6.43276 12.0221C6.1448 12.0196 5.87024 11.9094 5.67066 11.7166L0.313247 6.70742C-0.104648 6.31544 -0.104648 5.6818 0.313247 5.28982L5.67071 0.280717Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div
            className={`new-drop__track${isPressing ? " new-drop__track--dragging" : ""}`}
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={handleTrackClickCapture}
          >
            {products.map((product) => {
              const isWishlisted = wishlisted.has(product.id);
              return (
              <div className="new-drop-card" key={product.id}>
                <div className="new-drop-card__media">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                  />

                  <button
                    type="button"
                    className={`new-drop-card__wishlist${isWishlisted ? " new-drop-card__wishlist--active" : ""}`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    aria-pressed={isWishlisted}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8 13.2 1.6 7.1C-0.6 5 0 1.7 2.9 0.7 4.7 0.1 6.6 0.7 8 2.2 9.4 0.7 11.3 0.1 13.1 0.7 16 1.7 16.6 5 14.4 7.1L8 13.2Z"
                        fill={isWishlisted ? "#c1440e" : "none"}
                        stroke={isWishlisted ? "#c1440e" : "#301311"}
                        strokeWidth="1.3"
                      />
                    </svg>
                  </button>

                  <span className="new-drop-card__colors" aria-hidden="true">
                    {product.colorSwatches.map((hex) => (
                      <span
                        key={hex}
                        className="new-drop-card__swatch"
                        style={{ background: hex }}
                      />
                    ))}
                    <span className="new-drop-card__color-count">{product.colorCount}</span>
                  </span>

                  <button type="button" className="new-drop-card__add" aria-label={`Add ${product.name} to bag`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 8h12l-1 12H7L6 8Z"
                        stroke="#301311"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="#301311" strokeWidth="1.6" />
                      <path d="M16.5 11.5h4M18.5 9.5v4" stroke="#301311" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <div className="new-drop-card__info">
                  <span className="new-drop-card__code">{product.code}</span>
                  <p className="new-drop-card__name">{product.name}</p>
                  <span className="new-drop-card__price">{formatPrice(product.price)}</span>
                </div>
              </div>
              );
            })}
          </div>

          <button
            type="button"
            className="new-drop__nav new-drop__nav--next"
            aria-label="Next products"
            onClick={() => scrollByStep(1)}
          >
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.84296 11.7408C1.42239 12.1202 0.754058 12.114 0.340209 11.7282C-0.0723028 11.3413 -0.079023 10.7164 0.326816 10.3232L4.9275 6.02286L0.328187 1.72254L0.326848 1.72254C0.120588 1.53595 0.00272502 1.27923 4.71953e-05 1.00997C-0.00263166 0.741982 0.111215 0.482771 0.313456 0.292408C0.517037 0.103314 0.794267 -0.0031337 1.08091 -0.00062647C1.36887 0.0018779 1.64343 0.11208 1.84302 0.304931L7.20043 5.31407C7.61832 5.70605 7.61832 6.33968 7.20043 6.73166L1.84296 11.7408Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewDrop;