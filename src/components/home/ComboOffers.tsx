// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useCallback, useRef, useState } from "react";
// import { Container } from "react-bootstrap";
// import { useCart } from "@/context/CartContext";
// import type { Product } from "@/types/product";

// export interface ComboOffer {
//   id: number;
//   title: string;
//   price: string;
//   oldPrice?: string;
//   image: string;
//   alt: string;
//   href: string; 
// }

// const comboOffers: ComboOffer[] = [
//   {
//     id: 1,
//     title: "Tee + Cargo Combo",
//     price: "₹1,999",
//     oldPrice: "₹2,798",
//     image: "/assets/img/all-images/home/combo1.webp",
//     alt: "Oversized tee and cargo pants combo",
//     href: "/products/tee-cargo-combo",
//   },
//   {
//     id: 2,
//     title: "Hoodie + Joggers",
//     price: "₹2,499",
//     oldPrice: "₹3,398",
//     image: "/assets/img/all-images/home/combo2.webp",
//     alt: "Hoodie and joggers combo",
//     href: "/products/hoodie-joggers-combo",
//   },
//   {
//     id: 3,
//     title: "Graphic Duo",
//     price: "₹1,499",
//     oldPrice: "₹1,998",
//     image: "/assets/img/all-images/home/combo3.webp",
//     alt: "Two graphic printed tees combo",
//     href: "/products/graphic-duo-combo",
//   },
//   {
//     id: 4,
//     title: "Cap + Tee Combo",
//     price: "₹1,299",
//     oldPrice: "₹1,698",
//     image: "/assets/img/all-images/home/combo1.webp",
//     alt: "Cap and tee combo",
//     href: "/products/cap-tee-combo",
//   },
//   {
//     id: 5,
//     title: "Shirt + Trouser",
//     price: "₹2,199",
//     oldPrice: "₹2,998",
//     image: "/assets/img/all-images/home/combo2.webp",
//     alt: "Shirt and trouser combo",
//     href: "/products/shirt-trouser-combo",
//   },
//   {
//     id: 6,
//     title: "Shirt + Trouser",
//     price: "₹2,199",
//     oldPrice: "₹2,998",
//     image: "/assets/img/all-images/home/combo3.webp",
//     alt: "Shirt and trouser combo",
//     href: "/products/shirt-trouser-combo",
//   },
//   {
//     id: 7,
//     title: "Shirt + Trouser",
//     price: "₹2,199",
//     oldPrice: "₹2,998",
//     image: "/assets/img/all-images/home/combo1.webp",
//     alt: "Shirt and trouser combo",
//     href: "/products/shirt-trouser-combo",
//   },
//   {
//     id: 8,
//     title: "Shirt + Trouser",
//     price: "₹2,199",
//     oldPrice: "₹2,998",
//     image: "/assets/img/all-images/home/combo2.webp",
//     alt: "Shirt and trouser combo",
//     href: "/products/shirt-trouser-combo",
//   },
// ];

// const toNumber = (s: string) => Number(s.replace(/[^0-9]/g, ""));

// /**
//  * A combo goes into the cart like any other product. Ids start at 9000 so they
//  * can never clash with a catalog product id; "combo-" slugs are recognised by the cart.
//  */
// const comboToProduct = (c: ComboOffer): Product => ({
//   id: 9000 + c.id,
//   slug: `combo-${c.id}`,
//   name: c.title,
//   description: c.alt,
//   category: "combo",
//   subcategory: "combo",
//   price: toNumber(c.price),
//   mrp: toNumber(c.oldPrice ?? c.price),
//   images: [c.image],
//   variants: [],
//   colors: [],
// });

// const getDiscount = (price: string, oldPrice?: string) => {
//   if (!oldPrice) return null;
//   const num = (s: string) => Number(s.replace(/[^0-9]/g, ""));
//   const p = num(price);
//   const o = num(oldPrice);
//   if (!o) return null;
//   return Math.round(((o - p) / o) * 100);
// };

// export default function ComboOffers() {
//   const { addItem, isInCart } = useCart();
//   const trackRef = useRef<HTMLDivElement>(null);
//   const [isPressing, setIsPressing] = useState(false);
//   const isDraggingRef = useRef(false);
//   const dragStartXRef = useRef(0);
//   const dragScrollStartRef = useRef(0);
//   const draggedRef = useRef(false);

//   const scrollByCard = useCallback((direction: "left" | "right") => {
//     const track = trackRef.current;
//     if (!track) return;
//     const card = track.querySelector<HTMLElement>(".combo-slide");
//     const cardWidth = card ? card.offsetWidth + 20 : track.offsetWidth;
//     track.scrollBy({
//       left: direction === "left" ? -cardWidth : cardWidth,
//       behavior: "smooth",
//     });
//   }, []);

//   const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
//     const track = trackRef.current;
//     if (!track) return;
//     // a press that starts on the button / link must stay a normal click,
//     // otherwise pointer capture swallows it and "Add to Cart" never fires
//     if ((e.target as HTMLElement).closest("button, a")) return;
//     // touch screens scroll natively (smooth, with momentum + snapping); JS drag is for the mouse only
//     if (e.pointerType !== "mouse") return;
//     isDraggingRef.current = true;
//     setIsPressing(true);
//     draggedRef.current = false;
//     dragStartXRef.current = e.clientX;
//     dragScrollStartRef.current = track.scrollLeft;
//     track.setPointerCapture(e.pointerId);
//   }, []);

//   const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
//     if (!isDraggingRef.current) return;
//     const track = trackRef.current;
//     if (!track) return;
//     const delta = e.clientX - dragStartXRef.current;
//     if (Math.abs(delta) > 4) draggedRef.current = true;
//     track.scrollLeft = dragScrollStartRef.current - delta;
//   }, []);

//   const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
//     const track = trackRef.current;
//     if (track && track.hasPointerCapture(e.pointerId)) {
//       track.releasePointerCapture(e.pointerId);
//     }
//     isDraggingRef.current = false;
//     setIsPressing(false);
//   }, []);

//   // Prevent the "Add to Cart" button from firing right after a drag
//   const handleTrackClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
//     if (draggedRef.current) {
//       e.preventDefault();
//       e.stopPropagation();
//       draggedRef.current = false;
//     }
//   }, []);

//   return (
//     <section className="combo-section" id="combo-offers" aria-labelledby="combo-heading">
//       <div className="combo-curve" aria-hidden="true" />

//       <Container>
//         <div className="combo-heading-wrap">
//           <h2 className="combo-heading" id="combo-heading">
//             COMBO OFFERS
//           </h2>
//         </div>

//         <div className="combo-carousel">
//           <button
//             type="button"
//             className="combo-offers-nav combo-offers-nav--prev"
//             onClick={() => scrollByCard("left")}
//             aria-label="Previous combo"
//           >
//             <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M1.84296 11.7408C1.42239 12.1202 0.754058 12.114 0.340209 11.7282C-0.0723028 11.3413 -0.079023 10.7164 0.326816 10.3232L4.9275 6.02286L0.328187 1.72254L0.326848 1.72254C0.120588 1.53595 0.00272502 1.27923 4.71953e-05 1.00997C-0.00263166 0.741982 0.111215 0.482771 0.313456 0.292408C0.517037 0.103314 0.794267 -0.0031337 1.08091 -0.00062647C1.36887 0.0018779 1.64343 0.11208 1.84302 0.304931L7.20043 5.31407C7.61832 5.70605 7.61832 6.33968 7.20043 6.73166L1.84296 11.7408Z" fill="currentColor" />
//             </svg>
//           </button>

//           <div className="combo-track-wrap">
//             <div
//               className={`combo-track${isPressing ? " combo-track--dragging" : ""}`}
//               ref={trackRef}
//               onPointerDown={handlePointerDown}
//               onPointerMove={handlePointerMove}
//               onPointerUp={endDrag}
//               onPointerLeave={endDrag}
//               onPointerCancel={endDrag}
//               onClickCapture={handleTrackClickCapture}
//             >
//               {comboOffers.map((combo) => {
//                 const discount = getDiscount(combo.price, combo.oldPrice);
//                 return (
//                   <article key={combo.id} className="combo-slide">
//                     <div className="combo-card">
//                       {discount ? (
//                         <span className="combo-badge">{discount}% OFF</span>
//                       ) : null}

//                       <div className="combo-image-wrap">
//                         <Image
//                           src={combo.image}
//                           alt={combo.alt}
//                           fill
//                           sizes="(max-width: 480px) 90vw,
//                                  (max-width: 768px) 45vw,
//                                  (max-width: 1200px) 30vw,
//                                  320px"
//                           className="combo-image"
//                           priority={false}
//                           draggable={false}
//                         />
//                       </div>

//                       <div className="combo-info">
//                         <Link href={comboHrefById(combo.id)} className="combo-title-link" draggable={false}>
                        //   <p className="combo-title">{combo.title}</p>
                        // </Link>

//                         <div className="combo-bottom-row">
//                           <div className="combo-price-block">
//                             <span className="combo-price">{combo.price}</span>
//                             {combo.oldPrice && (
//                               <span className="combo-old-price">{combo.oldPrice}</span>
//                             )}
//                           </div>

//                           {isInCart(9000 + combo.id) ? (
//                             <Link href="/cart" className="combo-buy-btn">
//                               View Cart
//                             </Link>
//                           ) : (
//                             <button
//                               type="button"
//                               className="combo-buy-btn"
//                               onClick={() => addItem(comboToProduct(combo))}
//                             >
//                               Add to Cart
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </article>
//                 );
//               })}
//             </div>
//           </div>

//           <button
//             type="button"
//             className="combo-offers-nav combo-offers-nav--next"
//             onClick={() => scrollByCard("right")}
//             aria-label="Next combo"
//           >
//             <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M1.84296 11.7408C1.42239 12.1202 0.754058 12.114 0.340209 11.7282C-0.0723028 11.3413 -0.079023 10.7164 0.326816 10.3232L4.9275 6.02286L0.328187 1.72254L0.326848 1.72254C0.120588 1.53595 0.00272502 1.27923 4.71953e-05 1.00997C-0.00263166 0.741982 0.111215 0.482771 0.313456 0.292408C0.517037 0.103314 0.794267 -0.0031337 1.08091 -0.00062647C1.36887 0.0018779 1.64343 0.11208 1.84302 0.304931L7.20043 5.31407C7.61832 5.70605 7.61832 6.33968 7.20043 6.73166L1.84296 11.7408Z" fill="currentColor" />
//             </svg>
//           </button>
//         </div>
//       </Container>
//     </section>
//   );
// }



"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";
import { COMBO_ITEMS, buildComboKeys, comboHrefById, type ComboItem } from "@/lib/combos";

export interface ComboOffer {
  id: number;
  title: string;
  price: string;
  oldPrice?: string;
  image: string;
  alt: string;
  href: string; 
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

const toNumber = (s: string) => Number(s.replace(/[^0-9]/g, ""));


const comboToProduct = (c: ComboOffer): Product => ({
  id: 9000 + c.id,
  slug: `combo-${c.id}`,
  name: c.title,
  description: c.alt,
  category: "combo",
  subcategory: "combo",
  price: toNumber(c.price),
  mrp: toNumber(c.oldPrice ?? c.price),
  images: [c.image],
  variants: [],
  colors: [],
});

const getDiscount = (price: string, oldPrice?: string) => {
  if (!oldPrice) return null;
  const num = (s: string) => Number(s.replace(/[^0-9]/g, ""));
  const p = num(price);
  const o = num(oldPrice);
  if (!o) return null;
  return Math.round(((o - p) / o) * 100);
};

export default function ComboOffers() {
  const { addItem, isInCart } = useCart();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPressing, setIsPressing] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollStartRef = useRef(0);
  const draggedRef = useRef(false);
  const router = useRouter();

  const [activeCombo, setActiveCombo] = useState<ComboOffer | null>(null);
  const [colorIdx, setColorIdx] = useState<number[]>([]);
  const [sizes, setSizes] = useState<(string | null)[]>([]);
  const [sizeError, setSizeError] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeItems: ComboItem[] = activeCombo ? COMBO_ITEMS[activeCombo.id] ?? [] : [];

  const openPicker = (combo: ComboOffer) => {
    const items = COMBO_ITEMS[combo.id] ?? [];
    setActiveCombo(combo);
    setColorIdx(items.map(() => 0));
    setSizes(items.map((it) => (it.sizes.length === 1 ? it.sizes[0] : null)));
    setSizeError(false);
  };

  const closePicker = useCallback(() => setActiveCombo(null), []);

  useEffect(() => {
    if (!activeCombo) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePicker();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeCombo, closePicker]);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2200);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const allSized = activeItems.length > 0 && activeItems.every((_, i) => !!sizes[i]);
  
  const { size: sizeKey, color: colorKey, colorName: colorNameKey } = buildComboKeys(activeItems, colorIdx, sizes);
  const pickerInCart = !!activeCombo && allSized && isInCart(9000 + activeCombo.id, sizeKey, colorKey);

  const handleConfirm = () => {
    if (!activeCombo) return;
    if (pickerInCart) {
      setActiveCombo(null);
      router.push("/cart");
      return;
    }
    if (!allSized) {
      setSizeError(true);
      return;
    }
    addItem(comboToProduct(activeCombo), {
      size: sizeKey,
      color: colorKey,
      colorName: colorNameKey,
      image: activeCombo.image,
    });
    setToastMessage(`Added ${activeCombo.title} · ${sizeKey}`);
  };

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

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
   
    if ((e.target as HTMLElement).closest("button, a")) return;
    if (e.pointerType !== "mouse") return;
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

  // Prevent the "Add to Cart" button from firing right after a drag
  const handleTrackClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false;
    }
  }, []);

  return (
    <section className="combo-section" id="combo-offers" aria-labelledby="combo-heading">
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

                      <Link href={comboHrefById(combo.id)} className="combo-image-link" draggable={false}>
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
                      </Link>

                      <div className="combo-info">
                        <Link href={comboHrefById(combo.id)} className="combo-title-link" draggable={false}>
                          <p className="combo-title">{combo.title}</p>
                        </Link>

                        <div className="combo-bottom-row">
                          <div className="combo-price-block">
                            <span className="combo-price">{combo.price}</span>
                            {combo.oldPrice && (
                              <span className="combo-old-price">{combo.oldPrice}</span>
                            )}
                          </div>

                          <button
                            type="button"
                            className="combo-cart-btn"
                            aria-label={`Add ${combo.title} to cart`}
                            onClick={() => openPicker(combo)}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                              <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.6" />
                              <path d="M16.5 11.5h4M18.5 9.5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                          </button>
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

        <div className="combo-view-all">
          <Link href="/combo-offers" className="combo-view-all__btn">
            View all combo offers
          </Link>
        </div>
      </Container>

      {activeCombo && (
        <div
          className="quick-add__overlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closePicker();
          }}
        >
          <div
            className="quick-add__panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Add ${activeCombo.title} to cart`}
          >
            <button type="button" className="quick-add__close" aria-label="Close" onClick={closePicker}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <div className="quick-add__media">
              <Image
                src={activeCombo.image}
                alt={activeCombo.alt}
                fill
                sizes="(max-width: 720px) 100vw, 440px"
                draggable={false}
              />
            </div>

            <div className="quick-add__details quick-add__details--combo">
              <h3 className="quick-add__name">{activeCombo.title}</h3>
              <span className="quick-add__price">
                {activeCombo.price}
                {activeCombo.oldPrice && <s>{activeCombo.oldPrice}</s>}
              </span>

              {activeItems.map((item, i) => (
                <div className="quick-add__group" key={`${activeCombo.id}-${item.label}`}>
                  <h4 className="quick-add__group-title">{item.label}</h4>

                  <div className="quick-add__section">
                    <span className="quick-add__section-label">
                      Colour <em>{item.colors[colorIdx[i] ?? 0].name}</em>
                    </span>
                    <div className="quick-add__swatches">
                      {item.colors.map((color, ci) => (
                        <button
                          key={color.name}
                          type="button"
                          className={`quick-add__swatch${ci === (colorIdx[i] ?? 0) ? " quick-add__swatch--active" : ""}`}
                          style={{ background: color.hex }}
                          aria-label={`${item.label} colour ${color.name}`}
                          aria-pressed={ci === (colorIdx[i] ?? 0)}
                          onClick={() => setColorIdx((prev) => prev.map((v, k) => (k === i ? ci : v)))}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="quick-add__section">
                    <span className="quick-add__section-label">
                      Size {sizes[i] ? <em>{sizes[i]}</em> : null}
                    </span>
                    <div className="quick-add__sizes">
                      {item.sizes.map((size) => {
                        const available = !item.unavailable?.includes(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            disabled={!available}
                            className={`quick-add__size${sizes[i] === size ? " quick-add__size--active" : ""}`}
                            onClick={() => {
                              setSizes((prev) => prev.map((v, k) => (k === i ? size : v)));
                              setSizeError(false);
                            }}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {sizeError && (
                <span className="quick-add__error" role="alert">
                  Select a size for every item to continue
                </span>
              )}

              <button type="button" className="quick-add__confirm" onClick={handleConfirm}>
                {pickerInCart ? "View Cart" : "Add to Cart"}
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
}