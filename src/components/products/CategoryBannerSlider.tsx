// import React, { useCallback, useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import { CATEGORIES } from "@/lib/categories";

// interface BannerSlide {
//   id: string;
//   href: string;
//   desktopImg: string;
//   mobileImg: string;
//   alt: string;
//   label: string;
// }


// const SLIDE_OVERRIDES: Record<
//   string,
//   { href?: string; desktopImg?: string; mobileImg?: string }
// > = {
//   men: { href: "/men", desktopImg: "/assets/img/all-images/categories_banner/men.png", mobileImg: "" },
//   "men/shirts": { href: "men/shirts", desktopImg: "/assets/img/all-images/categories_banner/men.png", mobileImg: "" },
//   "men/t-shirts": { href: "men/t-shirts", desktopImg: "/assets/img/all-images/categories_banner/tshirts.png", mobileImg: "" },
//   "men/jeans": { href: "/men/jeans", desktopImg: "/assets/img/all-images/categories_banner/jeans.png", mobileImg: "" },
//   "men/jackets": { href: "/men/jackets", desktopImg: "/assets/img/all-images/categories_banner/jackets.png", mobileImg: "" },
//   women: { href: "", desktopImg: "", mobileImg: "" },
//   "women/dresses": { href: "", desktopImg: "", mobileImg: "" },
//   "women/tops": { href: "", desktopImg: "", mobileImg: "" },
//   "women/skirts": { href: "", desktopImg: "", mobileImg: "" },
//   "women/ethnic-wear": { href: "", desktopImg: "", mobileImg: "" },
//   kids: { href: "", desktopImg: "", mobileImg: "" },
//   "kids/boys": { href: "", desktopImg: "", mobileImg: "" },
//   "kids/girls": { href: "", desktopImg: "", mobileImg: "" },
//   "kids/infants": { href: "", desktopImg: "", mobileImg: "" },
// };

// const SLIDER_CATEGORIES = ["men", "women", "kids"];

// const IMG_BASE = "/assets/img/all-images/categories-banner";
// const AUTOPLAY_DELAY = 4000;

// interface CategoryBannerSliderProps {
//   category: string;
//   activeSubcategory?: string;
// }

// const CategoryBannerSlider: React.FC<CategoryBannerSliderProps> = ({
//   category,
//   activeSubcategory,
// }) => {
//   const config = SLIDER_CATEGORIES.includes(category)
//     ? CATEGORIES.find((c) => c.slug === category)
//     : undefined;

//   const buildSlide = (
//     key: string,
//     label: string,
//     defaultHref: string,
//     defaultFile: string
//   ): BannerSlide => {
//     const o = SLIDE_OVERRIDES[key] ?? {};
//     const desktopImg = o.desktopImg || `${IMG_BASE}/${defaultFile}.png`;
//     return {
//       id: key,
//       href: o.href || defaultHref,
//       desktopImg,
//       mobileImg: o.mobileImg || desktopImg,
//       alt: `${config?.label} - ${label}`,
//       label,
//     };
//   };

//   const slides: BannerSlide[] = config
//     ? [
//         buildSlide(category, `All ${config.label}`, `/${category}`, category),
//         ...config.subcategories.map((s) =>
//           buildSlide(
//             `${category}/${s.slug}`,
//             s.label,
//             `/${category}/${s.slug}`,
//             s.slug.replace(/-/g, "")
//           )
//         ),
//       ]
//     : [];

//   const total = slides.length;
//   const startIndex = Math.max(
//     0,
//     slides.findIndex((s) => s.id === `${category}/${activeSubcategory}`)
//   );

//   const [activeIndex, setActiveIndex] = useState(startIndex);
//   const [failed, setFailed] = useState<Record<string, boolean>>({});
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const touchX = useRef<number | null>(null);

//   const goTo = useCallback(
//     (i: number) => setActiveIndex(((i % total) + total) % total),
//     [total]
//   );

//   const stop = useCallback(() => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     timerRef.current = null;
//   }, []);

//   const start = useCallback(() => {
//     stop();
//     if (total < 2) return;
//     timerRef.current = setInterval(
//       () => setActiveIndex((p) => (p + 1) % total),
//       AUTOPLAY_DELAY
//     );
//   }, [stop, total]);

//   useEffect(() => {
//     start();
//     return stop;
//   }, [start, stop]);

//   if (!total) return null;

//   return (
//     <section
//       className="category-banner-slider"
//       aria-label={`${config?.label} category banners`}
//       onMouseEnter={stop}
//       onMouseLeave={start}
//     >
//       <div
//         className="category-banner-slider__viewport"
//         onTouchStart={(e) => {
//           touchX.current = e.touches[0].clientX;
//         }}
//         onTouchEnd={(e) => {
//           if (touchX.current === null) return;
//           const dx = e.changedTouches[0].clientX - touchX.current;
//           if (Math.abs(dx) > 40) goTo(activeIndex + (dx < 0 ? 1 : -1));
//           touchX.current = null;
//         }}
//       >
//         <div
//           className="category-banner-slider__track"
//           style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
//         >
//           {slides.map((slide, index) => (
//             <div
//               className="category-banner-slider__slide"
//               key={slide.id}
//               role="group"
//               aria-label={`${index + 1} / ${total}`}
//               aria-hidden={activeIndex !== index}
//             >
//               <Link
//                 href={slide.href}
//                 className="category-banner-slider__link"
//                 tabIndex={activeIndex === index ? 0 : -1}
//               >
//                 {failed[slide.id] ? (
//                   <span className="category-banner-slider__placeholder">
//                     <span className="category-banner-slider__placeholder-label">
//                       {slide.label}
//                     </span>
//                   </span>
//                 ) : (
//                   <picture>
//                     <source media="(max-width: 768px)" srcSet={slide.mobileImg} />
//                     <img
//                       src={slide.desktopImg}
//                       alt={slide.alt}
//                       className="category-banner-slider__img"
//                       loading={index === startIndex ? "eager" : "lazy"}
//                       decoding="async"
//                       onError={() =>
//                         setFailed((f) => ({ ...f, [slide.id]: true }))
//                       }
//                     />
//                   </picture>
//                 )}
//               </Link>
//             </div>
//           ))}
//         </div>

//         {total > 1 && (
//           <>
//             <button
//               type="button"
//               className="category-banner-slider__nav category-banner-slider__nav--prev"
//               aria-label="Previous slide"
//               onClick={() => goTo(activeIndex - 1)}
//             >
//               <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M5.67071 0.280717C6.09128 -0.0987274 6.75961 -0.0924762 7.17346 0.29324C7.58597 0.680185 7.59269 1.30507 7.18686 1.6983L2.58617 5.99862L7.18549 10.2989H7.18683C7.39308 10.4855 7.51095 10.7423 7.51363 11.0115C7.5163 11.2795 7.40246 11.5387 7.20022 11.7291C6.99664 11.9182 6.71941 12.0246 6.43276 12.0221C6.1448 12.0196 5.87024 11.9094 5.67066 11.7166L0.313247 6.70742C-0.104648 6.31544 -0.104648 5.6818 0.313247 5.28982L5.67071 0.280717Z" fill="white" />
//               </svg>
//             </button>
//             <button
//               type="button"
//               className="category-banner-slider__nav category-banner-slider__nav--next"
//               aria-label="Next slide"
//               onClick={() => goTo(activeIndex + 1)}
//             >
//               <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M1.84296 11.7408C1.42239 12.1202 0.754058 12.114 0.340209 11.7282C-0.0723028 11.3413 -0.079023 10.7164 0.326816 10.3232L4.9275 6.02286L0.328187 1.72254L0.326848 1.72254C0.120588 1.53595 0.00272502 1.27923 4.71953e-05 1.00997C-0.00263166 0.741982 0.111215 0.482771 0.313456 0.292408C0.517037 0.103314 0.794267 -0.0031337 1.08091 -0.00062647C1.36887 0.0018779 1.64343 0.11208 1.84302 0.304931L7.20043 5.31407C7.61832 5.70605 7.61832 6.33968 7.20043 6.73166L1.84296 11.7408Z" fill="white" />
//               </svg>
//             </button>

//             <div className="category-banner-slider__pagination">
//               {slides.map((slide, index) => (
//                 <button
//                   type="button"
//                   key={slide.id}
//                   className={`category-banner-slider__bullet${
//                     index === activeIndex ? " category-banner-slider__bullet--active" : ""
//                   }`}
//                   aria-label={`Go to slide ${index + 1}`}
//                   aria-current={index === activeIndex}
//                   onClick={() => goTo(index)}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   );
// };

// export default CategoryBannerSlider;



import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export interface BannerSlide {
  id: string;
  href: string;
  desktopImg: string;
  mobileImg: string;
  alt: string;
  label: string;
}


const SLIDE_OVERRIDES: Record<
  string,
  { href?: string; desktopImg?: string; mobileImg?: string }
> = {
  men: { href: "/men", desktopImg: "/assets/img/all-images/categories_banner/men.png", mobileImg: "" },
  "men/shirts": { href: "/men/shirts", desktopImg: "/assets/img/all-images/categories_banner/shirts.png", mobileImg: "" },
  "men/t-shirts": { href: "/men/t-shirts", desktopImg: "/assets/img/all-images/categories_banner/tshirts.png", mobileImg: "" },
  "men/jeans": { href: "/men/jeans", desktopImg: "/assets/img/all-images/categories_banner/jeans.png", mobileImg: "" },
  "men/jackets": { href: "/men/jackets", desktopImg: "/assets/img/all-images/categories_banner/jackets.png", mobileImg: "" },
  women: { href: "/women", desktopImg: "/assets/img/all-images/categories_banner/men.png", mobileImg: "" },
  "women/dresses": { href: "/women/dresses", desktopImg: "/assets/img/all-images/categories_banner/shirts.png", mobileImg: "" },
  "women/tops": { href: "/women/tops", desktopImg: "/assets/img/all-images/categories_banner/tshirts.png", mobileImg: "" },
  "women/skirts": { href: "/women/skirts", desktopImg: "/assets/img/all-images/categories_banner/jeans.png", mobileImg: "" },
  "women/ethnic-wear": { href: "/women/ethnic-wear", desktopImg: "/assets/img/all-images/categories_banner/jackets.png", mobileImg: "" },
  kids: { href: "/kids", desktopImg: "/assets/img/all-images/categories_banner/men.png", mobileImg: "" },
  "kids/boys": { href: "/kids/boys", desktopImg: "/assets/img/all-images/categories_banner/shirts.png", mobileImg: "" },
  "kids/girls": { href: "/kids/girls", desktopImg: "/assets/img/all-images/categories_banner/tshirts.png", mobileImg: "" },
  "kids/infants": { href: "/kids/infants", desktopImg: "/assets/img/all-images/categories_banner/jeans.png", mobileImg: "" },
};

const SLIDER_CATEGORIES = ["men", "women", "kids"];

const IMG_BASE = "/assets/img/all-images/categories_banner";
const AUTOPLAY_DELAY = 3000;

const normalizeHref = (href: string) =>
  /^(https?:)?\/\//.test(href) || href.startsWith("/") ? href : `/${href}`;

interface CategoryBannerSliderProps {
  category?: string;
  activeSubcategory?: string;
  /** own slides (e.g. the combo-offers page) instead of the category's sub-categories */
  slides?: BannerSlide[];
  /** id of the slide to start on when `slides` is given */
  activeSlideId?: string;
  /** aria-label of the slider when `slides` is given */
  label?: string;
}

const CategoryBannerSlider: React.FC<CategoryBannerSliderProps> = ({
  category = "",
  activeSubcategory,
  slides: customSlides,
  activeSlideId,
  label,
}) => {
  const config = SLIDER_CATEGORIES.includes(category)
    ? CATEGORIES.find((c) => c.slug === category)
    : undefined;

  const buildSlide = (
    key: string,
    label: string,
    defaultHref: string,
    defaultFile: string
  ): BannerSlide => {
    const o = SLIDE_OVERRIDES[key] ?? {};
    const desktopImg = o.desktopImg || `${IMG_BASE}/${defaultFile}.png`;
    return {
      id: key,
      href: normalizeHref(o.href || defaultHref),
      desktopImg,
      mobileImg: o.mobileImg || desktopImg,
      alt: `${config?.label} - ${label}`,
      label,
    };
  };

  const slides: BannerSlide[] = customSlides ?? (config
    ? [
      buildSlide(category, `All ${config.label}`, `/${category}`, category),
      ...config.subcategories.map((s) =>
        buildSlide(
          `${category}/${s.slug}`,
          s.label,
          `/${category}/${s.slug}`,
          s.slug.replace(/-/g, "")
        )
      ),
    ]
    : []);

  const total = slides.length;
  const startIndex = Math.max(
    0,
    slides.findIndex((s) =>
      s.id === (customSlides ? activeSlideId : `${category}/${activeSubcategory}`)
    )
  );

  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchX = useRef<number | null>(null);

  const goTo = useCallback(
    (i: number) => setActiveIndex(((i % total) + total) % total),
    [total]
  );

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const start = useCallback(() => {
    stop();
    if (total < 2) return;
    timerRef.current = setInterval(
      () => setActiveIndex((p) => (p + 1) % total),
      AUTOPLAY_DELAY
    );
  }, [stop, total]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  if (!total) return null;

  return (
    <section
      className="category-banner-slider"
      aria-label={`${label ?? config?.label} category banners`}
      onMouseEnter={stop}
      onMouseLeave={start}
    >
      <div
        className="category-banner-slider__viewport"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) goTo(activeIndex + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        <div
          className="category-banner-slider__track"
          style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
        >
          {slides.map((slide, index) => (
            <div
              className="category-banner-slider__slide"
              key={slide.id}
              role="group"
              aria-label={`${index + 1} / ${total}`}
              aria-hidden={activeIndex !== index}
            >
              <Link
                href={slide.href}
                className="category-banner-slider__link"
                tabIndex={activeIndex === index ? 0 : -1}
              >
                {failed[slide.id] ? (
                  <span className="category-banner-slider__placeholder">
                    <span className="category-banner-slider__placeholder-label">
                      {slide.label}
                    </span>
                  </span>
                ) : (
                  <picture>
                    <source media="(max-width: 768px)" srcSet={slide.mobileImg} />
                    <img
                      src={slide.desktopImg}
                      alt={slide.alt}
                      className="category-banner-slider__img"
                      loading={index === startIndex ? "eager" : "lazy"}
                      decoding="async"
                      onError={() =>
                        setFailed((f) => ({ ...f, [slide.id]: true }))
                      }
                    />
                  </picture>
                )}
              </Link>
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              className="category-banner-slider__nav category-banner-slider__nav--prev"
              aria-label="Previous slide"
              onClick={() => goTo(activeIndex - 1)}
            >
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.67071 0.280717C6.09128 -0.0987274 6.75961 -0.0924762 7.17346 0.29324C7.58597 0.680185 7.59269 1.30507 7.18686 1.6983L2.58617 5.99862L7.18549 10.2989H7.18683C7.39308 10.4855 7.51095 10.7423 7.51363 11.0115C7.5163 11.2795 7.40246 11.5387 7.20022 11.7291C6.99664 11.9182 6.71941 12.0246 6.43276 12.0221C6.1448 12.0196 5.87024 11.9094 5.67066 11.7166L0.313247 6.70742C-0.104648 6.31544 -0.104648 5.6818 0.313247 5.28982L5.67071 0.280717Z" fill="white" />
              </svg>
            </button>
            <button
              type="button"
              className="category-banner-slider__nav category-banner-slider__nav--next"
              aria-label="Next slide"
              onClick={() => goTo(activeIndex + 1)}
            >
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.84296 11.7408C1.42239 12.1202 0.754058 12.114 0.340209 11.7282C-0.0723028 11.3413 -0.079023 10.7164 0.326816 10.3232L4.9275 6.02286L0.328187 1.72254L0.326848 1.72254C0.120588 1.53595 0.00272502 1.27923 4.71953e-05 1.00997C-0.00263166 0.741982 0.111215 0.482771 0.313456 0.292408C0.517037 0.103314 0.794267 -0.0031337 1.08091 -0.00062647C1.36887 0.0018779 1.64343 0.11208 1.84302 0.304931L7.20043 5.31407C7.61832 5.70605 7.61832 6.33968 7.20043 6.73166L1.84296 11.7408Z" fill="white" />
              </svg>
            </button>

            <div className="category-banner-slider__pagination">
              {slides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.id}
                  className={`category-banner-slider__bullet${index === activeIndex ? " category-banner-slider__bullet--active" : ""
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === activeIndex}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryBannerSlider;