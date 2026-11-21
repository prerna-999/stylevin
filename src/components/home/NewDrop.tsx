import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { dummyProducts } from "@/data/dummyProducts";

interface SizeOption {
  label: string;
  available: boolean;
}

interface ColorVariant {
  name: string;
  hex: string;
  image: string;
  sizes: SizeOption[];
}

interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  variants: ColorVariant[];
}

const CDN = "https://cdn.shopify.com/s/files/1/0753/1056/3627/files";

const sizeRun = (unavailable: string[] = []): SizeOption[] =>
  ["XS", "S", "M", "L", "XL", "XXL"].map((label) => ({
    label,
    available: !unavailable.includes(label),
  }));

const MEN_PRODUCTS: Product[] = [
  {
    id: "mz28",
    code: "#MZ28",
    name: "Super Combed Cotton Rich Graphic Printed T-Shirt",
    price: 999,
    variants: [
      {
        name: "Egret",
        hex: "#e8e2d6",
        image: `${CDN}/MZ28_IPEGRET_0101_S126_Jky_01.jpg?width=700&height=910`,
        sizes: sizeRun(["XS"]),
      },
      {
        name: "Coffee Bean",
        hex: "#301311",
        // TODO: replace with the actual Coffee Bean product photo when available
        image: `${CDN}/MZ28_IPEGRET_0101_S126_Jky_01.jpg?width=700&height=910`,
        sizes: sizeRun(["XS", "XXL"]),
      },
    ],
  },
  {
    id: "mz35-monrk",
    code: "#MZ35",
    name: "Microfiber Fabric Oversized Cargo Utility Pants",
    price: 2299,
    variants: [
      {
        name: "Moon Rock",
        hex: "#8a8478",
        image: `${CDN}/MZ35_IPMONRK_0101_S126_Jky_1.jpg?width=700&height=910`,
        sizes: sizeRun(["XS"]),
      },
      {
        name: "Coffee Bean",
        hex: "#301311",
        image: `${CDN}/MZ35_IPMONRK_0101_S126_Jky_1.jpg?width=700&height=910`,
        sizes: sizeRun(["XS", "S"]),
      },
    ],
  },
  {
    id: "mz31",
    code: "#MZ31",
    name: "Lightweight Microfiber Fabric Oversized Graphic Printed T-Shirt",
    price: 999,
    variants: [
      {
        name: "Black",
        hex: "#111111",
        image: `${CDN}/MZ31_IPBLACK_0101_S126_Jky_01.jpg?width=700&height=910`,
        sizes: sizeRun(),
      },
      {
        name: "Moon Rock",
        hex: "#8a8478",
        image: `${CDN}/MZ31_IPBLACK_0101_S126_Jky_01.jpg?width=700&height=910`,
        sizes: sizeRun(["XS", "XL", "XXL"]),
      },
    ],
  },
  {
    id: "mz16",
    code: "#MZ16",
    name: "Microfiber Cotton Blend Elastane Stretch Hoodie Sweatshirt",
    price: 2599,
    variants: [
      {
        name: "Black",
        hex: "#111111",
        image: `${CDN}/MZ16_IPBLACK_0101_S225_JKY_1.webp?width=700&height=910`,
        sizes: sizeRun(["XS"]),
      },
      {
        name: "Espresso",
        hex: "#4a3f35",
        image: `${CDN}/MZ16_IPBLACK_0101_S225_JKY_1.webp?width=700&height=910`,
        sizes: sizeRun(["XS", "S", "XXL"]),
      },
    ],
  },
  {
    id: "mz34",
    code: "#MZ34",
    name: "Super Combed Cotton Rich Mesh Fabric Oversized Polo T-Shirt",
    price: 1299,
    variants: [
      {
        name: "Blue Heaven",
        hex: "#7fa8c9",
        image: `${CDN}/MZ34_IPBUHVN_0101_S126_Jky_1.jpg?width=700&height=910`,
        sizes: sizeRun(),
      },
      {
        name: "Coffee Bean",
        hex: "#301311",
        image: `${CDN}/MZ34_IPBUHVN_0101_S126_Jky_1.jpg?width=700&height=910`,
        sizes: sizeRun(["XS", "XXL"]),
      },
    ],
  },
  {
    id: "mz33",
    code: "#MZ33",
    name: "Microfiber Fabric Regular Fit Shorts with Side Pockets",
    price: 1399,
    variants: [
      {
        name: "Black",
        hex: "#111111",
        image: `${CDN}/MZ33_IPBLACK_0101_S126_Jky_01.jpg?width=700&height=910`,
        sizes: sizeRun(["XS"]),
      },
      {
        name: "Golden Olive",
        hex: "#755b0b",
        image: `${CDN}/MZ33_IPBLACK_0101_S126_Jky_01.jpg?width=700&height=910`,
        sizes: sizeRun(["XS", "S", "M"]),
      },
    ],
  },
];

const WOMEN_PRODUCTS: Product[] = [
  {
    id: "wz03",
    code: "#WZ03",
    name: "Super Combed Cotton Rich Elastane Stretch Oversized Boxy Fit Crop Top",
    price: 699,
    variants: [
      {
        name: "Blue Mirage",
        hex: "#6f8fa8",
        image: `${CDN}/WZ03_BlueMiraj_0103_S125_JKY_1.webp?width=700&height=910`,
        sizes: sizeRun(),
      },
      {
        name: "Coffee Bean",
        hex: "#301311",
        image: `${CDN}/WZ03_BlueMiraj_0103_S125_JKY_1.webp?width=700&height=910`,
        sizes: sizeRun(["XS", "XXL"]),
      },
    ],
  },
  {
    id: "wz09-dkhak",
    code: "#WZ09",
    name: "Super Combed Cotton Regular Fit Hybrid Pants",
    price: 1299,
    variants: [
      {
        name: "Dark Khaki",
        hex: "#6e6248",
        image: `${CDN}/WZ09_DKHAK_0103_S125_JKY_1.webp?width=700&height=910`,
        sizes: sizeRun(["XS"]),
      },
      {
        name: "Jet Black",
        hex: "#111111",
        image: `${CDN}/WZ09_DKHAK_0103_S125_JKY_1.webp?width=700&height=910`,
        sizes: sizeRun(["XS", "S"]),
      },
    ],
  },
  {
    id: "wz10",
    code: "#WZ10",
    name: "Super Combed Cotton Rich French Terry Oversized Sleeves Hoodie",
    price: 1399,
    variants: [
      {
        name: "Quail",
        hex: "#c9b79c",
        image: `${CDN}/WZ10_QUAIL_0101_S225_JKY_1.webp?width=700&height=910`,
        sizes: sizeRun(),
      },
      {
        name: "Espresso",
        hex: "#4a3f35",
        image: `${CDN}/WZ10_QUAIL_0101_S225_JKY_1.webp?width=700&height=910`,
        sizes: sizeRun(["XS", "XXL"]),
      },
    ],
  },
  {
    id: "wz24",
    code: "#WZ24",
    name: "Super Combed Cotton Elastane Stretch Slim Fit Racerback Tank Top",
    price: 999,
    variants: [
      {
        name: "Lilac Snow",
        hex: "#c9b9d9",
        image: `${CDN}/WZ24_IPLCSNW_0101_S126_Jky_1.jpg?width=700&height=910`,
        sizes: sizeRun(["XS"]),
      },
      {
        name: "Coffee Bean",
        hex: "#301311",
        image: `${CDN}/WZ24_IPLCSNW_0101_S126_Jky_1.jpg?width=700&height=910`,
        sizes: sizeRun(["XS", "S", "XXL"]),
      },
    ],
  },
  {
    id: "wz28",
    code: "#WZ28",
    name: "Microfiber Fabric Skort with Side Zipper Pockets",
    price: 1199,
    variants: [
      {
        name: "Moon Rock",
        hex: "#8a8478",
        image: `${CDN}/WZ28_IPMONRK_0101_S126_Jky_1.jpg?width=700&height=910`,
        sizes: sizeRun(),
      },
      {
        name: "Jet Black",
        hex: "#111111",
        image: `${CDN}/WZ28_IPMONRK_0101_S126_Jky_1.jpg?width=700&height=910`,
        sizes: sizeRun(["XS", "XXL"]),
      },
    ],
  },
  {
    id: "wz26",
    code: "#WZ26",
    name: "Super Combed Cotton Rich Oversized Graphic Print T-Shirt",
    price: 1099,
    variants: [
      {
        name: "Egret",
        hex: "#e8e2d6",
        image: `${CDN}/WZ26_IPEGRET_0101_S126_Jky_1.jpg?width=700&height=910`,
        sizes: sizeRun(["XS"]),
      },
      {
        name: "Golden Olive",
        hex: "#755b0b",
        image: `${CDN}/WZ26_IPEGRET_0101_S126_Jky_1.jpg?width=700&height=910`,
        sizes: sizeRun(["XS", "S", "M"]),
      },
    ],
  },
];

const formatPrice = (value: number) =>
  `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const NewDrop: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"men" | "women">("men");
  const { has: isSaved, toggle: toggleSaved } = useWishlist();
  const { addItem, isInCart } = useCart();
  const router = useRouter();
  const [isPressing, setIsPressing] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollStartRef = useRef(0);
  const draggedRef = useRef(false);

  // Quick-add popup state
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const products = useMemo(
    () => (activeTab === "men" ? MEN_PRODUCTS : WOMEN_PRODUCTS),
    [activeTab]
  );

  const scrollByStep = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector<HTMLElement>(".new-drop-card");
    const step = firstCard ? firstCard.offsetWidth + 20 : 320;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    // Don't hijack pointer capture for clicks that start on an interactive
    // element (add-to-bag, wishlist) — otherwise the drag-scroll logic can
    // swallow the click on quick taps.
    if ((e.target as HTMLElement).closest("button")) return;
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

  // Home cards share the same wishlist as the rest of the site (matched by product code)
  const catalogId = (code: string) =>
    dummyProducts.find((p) => p.code === code)?.id;

  const toggleWishlist = (code: string) => {
    const id = catalogId(code);
    if (id !== undefined) toggleSaved(id);
  };

  const openQuickAdd = (product: Product) => {
    setQuickAddProduct(product);
    setActiveVariantIdx(0);
    setSelectedSize(null);
    setSizeError(false);
  };

  const closeQuickAdd = useCallback(() => {
    setQuickAddProduct(null);
  }, []);

  useEffect(() => {
    if (!quickAddProduct) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickAdd();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [quickAddProduct, closeQuickAdd]);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2200);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const handleVariantSelect = (idx: number) => {
    setActiveVariantIdx(idx);
    setSelectedSize(null);
    setSizeError(false);
  };

  const handleSizeSelect = (size: SizeOption) => {
    if (!size.available) return;
    setSelectedSize(size.label);
    setSizeError(false);
  };

  const handleConfirmAdd = () => {
    if (!quickAddProduct) return;
    const variant = quickAddProduct.variants[activeVariantIdx];
    const catalogItem = dummyProducts.find((p) => p.code === quickAddProduct.code);

    // already in the cart → the button reads "View Cart"
    if (catalogItem && selectedSize && isInCart(catalogItem.id, selectedSize, variant.hex)) {
      setQuickAddProduct(null);
      router.push("/cart");
      return;
    }
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    if (catalogItem) {
      addItem(catalogItem, {
        size: selectedSize,
        color: variant.hex,
        colorName: variant.name,
        image: variant.image,
      });
    }
    setToastMessage(`Added ${quickAddProduct.name} · ${variant.name} · ${selectedSize}`);
    // stay open so the button can switch to "View Cart"
  };

  const activeVariant = quickAddProduct?.variants[activeVariantIdx];
  const quickAddCatalog = quickAddProduct
    ? dummyProducts.find((p) => p.code === quickAddProduct.code)
    : undefined;
  const quickAddInCart =
    !!quickAddCatalog &&
    !!selectedSize &&
    !!activeVariant &&
    isInCart(quickAddCatalog.id, selectedSize, activeVariant.hex);

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
              const catalogProductId = catalogId(product.code);
              const isWishlisted = catalogProductId !== undefined && isSaved(catalogProductId);
              const listingVariant = product.variants[0];
              return (
                <div className="new-drop-card" key={product.id}>
                  <div className="new-drop-card__media">
                    <div className="new-drop-card__media-clip">
                      <img
                        src={listingVariant.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <button
                      type="button"
                      className={`new-drop-card__wishlist${isWishlisted ? " new-drop-card__wishlist--active" : ""}`}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      aria-pressed={isWishlisted}
                      onClick={() => toggleWishlist(product.code)}
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

                    {/* <span className="new-drop-card__colors" aria-hidden="true">
                      {product.variants.map((variant) => (        
                        <span
                          key={variant.hex}
                          className="new-drop-card__swatch"
                          style={{ background: variant.hex }}
                        />
                      ))}
                      <span className="new-drop-card__color-count">{product.variants.length}</span>
                    </span> */}

                    <button
                      type="button"
                      className="new-drop-card__add"
                      aria-label={`Add ${product.name} to bag`}
                      onClick={() => openQuickAdd(product)}
                    >
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
                    <p className="new-drop-card__name">{product.name} - {listingVariant.name}</p>
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

      {quickAddProduct && activeVariant && (
        <div
          className="quick-add__overlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeQuickAdd();
          }}
        >
          <div
            className="quick-add__panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Add ${quickAddProduct.name} to bag`}
          >
            <button
              type="button"
              className="quick-add__close"
              aria-label="Close"
              onClick={closeQuickAdd}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <div className="quick-add__media">
              <img src={activeVariant.image} alt={`${quickAddProduct.name} - ${activeVariant.name}`} />
            </div>

            <div className="quick-add__details">
              <span className="quick-add__code">{quickAddProduct.code}</span>
              <h3 className="quick-add__name">{quickAddProduct.name}</h3>
              <span className="quick-add__price">{formatPrice(quickAddProduct.price)}</span>

              <div className="quick-add__section">
                <span className="quick-add__section-label">
                  Colour <em>{activeVariant.name}</em>
                </span>
                <div className="quick-add__swatches">
                  {quickAddProduct.variants.map((variant, idx) => (
                    <button
                      key={variant.name}
                      type="button"
                      className={`quick-add__swatch${idx === activeVariantIdx ? " quick-add__swatch--active" : ""}`}
                      style={{ background: variant.hex }}
                      aria-label={variant.name}
                      aria-pressed={idx === activeVariantIdx}
                      onClick={() => handleVariantSelect(idx)}
                    />
                  ))}
                </div>
              </div>

              <div className="quick-add__section">
                <span className="quick-add__section-label">
                  Size {selectedSize ? <em>{selectedSize}</em> : null}
                </span>
                <div className="quick-add__sizes">
                  {activeVariant.sizes.map((size) => (
                    <button
                      key={size.label}
                      type="button"
                      disabled={!size.available}
                      className={`quick-add__size${selectedSize === size.label ? " quick-add__size--active" : ""}`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <span className="quick-add__error" role="alert">
                    Select a size to continue
                  </span>
                )}
              </div>

              <button type="button" className="quick-add__confirm" onClick={handleConfirmAdd}>
                {quickAddInCart ? "View Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="quick-add__toast" role="status">
          {toastMessage}
        </div>
      )}
    </section>
  );
};

export default NewDrop;