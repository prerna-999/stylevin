import React, { useCallback, useRef } from "react";

interface ReelProduct {
  img: string;
  title: string;
  price: string;
}

interface ReelSlide {
  id: string;
  href: string;
  videoSrc: string;
  poster: string;
  alt: string;
  products: ReelProduct[];
}

const CDN = "https://cdn.shopify.com/s/files/1/0753/1056/3627/files";

const REELS: ReelSlide[] = [
  {
    id: "reel-1",
    href: "https://www.instagram.com/reel/DSm63_bka3T/",
    videoSrc: `${CDN}/tn_1a745ae6-4ed2-4a18-9a17-8e82ecccb38f.mp4?v=1782457008`,
    poster: `${CDN}/poster_1a745ae6-4ed2-4a18-9a17-8e82ecccb38f.webp?width=400&height=400`,
    alt: "JKY Groove reel - graphic tee and cargo pants",
    products: [
      { img: `${CDN}/MZ28_IPEGRET_0101_S126_Jky_01.jpg?width=160&height=160`, title: "Super Combed Cotton Rich Graphic Printed T-Shirt - Egret", price: "₹ 999" },
      { img: `${CDN}/MZ35_IPMONRK_0101_S126_Jky_1.jpg?width=160&height=160`, title: "Microfiber Fabric Oversized Cargo Utility Pants with Inner Drawstrings - Moon Rock", price: "₹ 2,299" },
    ],
  },
  {
    id: "reel-2",
    href: "https://www.instagram.com/reel/DKUcLlEMT8M/",
    videoSrc: `${CDN}/tn_50731827-9424-4b76-a271-cbb87209925d.mp4?v=1782457001`,
    poster: `${CDN}/poster_50731827-9424-4b76-a271-cbb87209925d.webp?width=400&height=400`,
    alt: "JKY Groove reel - black graphic tee and cargo pants",
    products: [
      { img: `${CDN}/MZ31_IPBLACK_0101_S126_Jky_01.jpg?width=160&height=160`, title: "Lightweight Microfiber Fabric Oversized Graphic Printed T-Shirt - Black", price: "₹ 999" },
      { img: `${CDN}/MZ35_IPBLACK_0101_S126_Jky_1.jpg?width=160&height=160`, title: "Microfiber Fabric Oversized Cargo Utility Pants with Inner Drawstrings - Black", price: "₹ 2,299" },
    ],
  },
  {
    id: "reel-3",
    href: "https://www.instagram.com/reel/DTxeF7IEUOI/",
    videoSrc: `${CDN}/tn_3ff55ddf-9de7-40ff-b464-2771e7362acb.mp4?v=1780959633`,
    poster: `${CDN}/poster_3ff55ddf-9de7-40ff-b464-2771e7362acb.webp?width=400&height=400`,
    alt: "JKY Groove reel - crop top and hybrid pants",
    products: [
      { img: `${CDN}/WZ03_BlueMiraj_0103_S125_JKY_1.webp?width=160&height=160`, title: "Super Combed Cotton Rich Elastane Stretch Oversized Boxy Fit Crop Top - Blue Mirage", price: "₹ 699" },
      { img: `${CDN}/WZ09_DKHAK_0103_S125_JKY_1.webp?width=160&height=160`, title: "Super Combed Cotton Regular Fit Hybrid Pants - Dark Khaki", price: "₹ 1,299" },
    ],
  },
  {
    id: "reel-4",
    href: "https://www.instagram.com/reel/DSkU9ftkdAC/",
    videoSrc: `${CDN}/tn_1cbae1a1-31be-4ecc-a34d-0fa0841c2f0d.mp4?v=1780959630`,
    poster: `${CDN}/poster_1cbae1a1-31be-4ecc-a34d-0fa0841c2f0d.webp?width=400&height=400`,
    alt: "JKY Groove reel - hoodie and cargo jogger",
    products: [
      { img: `${CDN}/MZ16_IPBLACK_0101_S225_JKY_1.webp?width=160&height=160`, title: "Microfiber Cotton Blend Elastane Stretch Hoodie Sweatshirt - Black", price: "₹ 2,599" },
      { img: `${CDN}/MZ10_BLACK_0101_S125_JKY_1.webp?width=160&height=160`, title: "Super Combed Cotton Woven Regular Fit Cargo Jogger with Seven Pockets - Black", price: "₹ 1,819" },
    ],
  },
  {
    id: "reel-5",
    href: "https://www.instagram.com/reel/DMXusp4xAU_/",
    videoSrc: `${CDN}/tn_522ba977-5816-4fd0-bf1f-603b1bd7d198.mp4?v=1780959624`,
    poster: `${CDN}/poster_522ba977-5816-4fd0-bf1f-603b1bd7d198.webp?width=400&height=400`,
    alt: "JKY Groove reel - hoodie and hybrid pants",
    products: [
      { img: `${CDN}/WZ10_QUAIL_0101_S225_JKY_1.webp?width=160&height=160`, title: "Super Combed Cotton Rich French Terry Oversized Sleeves Hoodie - Quail", price: "₹ 1,399" },
      { img: `${CDN}/WZ09_BLACK_0103_S125_JKY_1.webp?width=160&height=160`, title: "Super Combed Cotton Regular Fit Hybrid Pants - Black", price: "₹ 1,209" },
    ],
  },
  {
    id: "reel-6",
    href: "https://www.instagram.com/reel/DTu7Pm8kbUJ/",
    videoSrc: `${CDN}/tn_ea56497d-b542-4ebc-9831-e4f3e3c72565.mp4?v=1780959639`,
    poster: `${CDN}/poster_ea56497d-b542-4ebc-9831-e4f3e3c72565.webp?width=400&height=400`,
    alt: "JKY Groove reel - crop top and cargo jogger",
    products: [
      { img: `${CDN}/WZ03_DPBLK_0103_S125_JKY_1.webp?width=160&height=160`, title: "Super Combed Cotton Rich Elastane Stretch Oversized Boxy Fit Crop Top - Deep Black", price: "₹ 699" },
      { img: `${CDN}/MZ10_DKHAK_0101_S125_JKY_1.webp?width=160&height=160`, title: "Super Combed Cotton Woven Regular Fit Cargo Jogger with Seven Pockets - Dark Khaki", price: "₹ 1,899" },
    ],
  },
  {
    id: "reel-7",
    href: "https://www.instagram.com/reel/DTnMKBTjVLn/",
    videoSrc: `${CDN}/tn_a1ee26b1-e9b7-46c7-bab0-63b19ec3773e.mp4?v=1782457013`,
    poster: `${CDN}/poster_a1ee26b1-e9b7-46c7-bab0-63b19ec3773e.webp?width=400&height=400`,
    alt: "JKY Groove reel - polo tee and shorts",
    products: [
      { img: `${CDN}/MZ34_IPBUHVN_0101_S126_Jky_1.jpg?width=160&height=160`, title: "Super Combed Cotton Rich Mesh Fabric Oversized Polo T-Shirt with Breathable Mesh - Blue Heaven", price: "₹ 1,299" },
      { img: `${CDN}/MZ33_IPBLACK_0101_S126_Jky_01.jpg?width=160&height=160`, title: "Microfiber Fabric Regular Fit Shorts with Side Pockets - Black", price: "₹ 1,399" },
    ],
  },
];

const SCROLL_STEP = 372;

const Instagram: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollByStep = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * SCROLL_STEP, behavior: "smooth" });
  }, []);

  return (
    <section className="instagram-section pt-80" aria-label="JKY Groove on Instagram">
      <div className="instagram-section__inner">
        <header className="instagram-section__header">
          <span className="instagram-section__eyebrow">Stylevin</span>
          <h2 className="instagram-section__title">ON LOOP</h2>
        </header>

        <div className="instagram-section__carousel">
          <button
            type="button"
            className="instagram-section__nav instagram-section__nav--prev"
            aria-label="Previous reels"
            onClick={() => scrollByStep(-1)}
          >
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.67071 0.280717C6.09128 -0.0987274 6.75961 -0.0924762 7.17346 0.29324C7.58597 0.680185 7.59269 1.30507 7.18686 1.6983L2.58617 5.99862L7.18549 10.2989H7.18683C7.39308 10.4855 7.51095 10.7423 7.51363 11.0115C7.5163 11.2795 7.40246 11.5387 7.20022 11.7291C6.99664 11.9182 6.71941 12.0246 6.43276 12.0221C6.1448 12.0196 5.87024 11.9094 5.67066 11.7166L0.313247 6.70742C-0.104648 6.31544 -0.104648 5.6818 0.313247 5.28982L5.67071 0.280717Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div className="instagram-section__track" ref={trackRef}>
            {REELS.map((reel, index) => (
              <a
                key={reel.id}
                href={reel.href}
                target="_blank"
                rel="noreferrer noopener"
                className="instagram-card"
                aria-label={reel.alt}
              >
                <span className="instagram-card__badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="1.6" />
                    <circle cx="12" cy="12" r="4.6" stroke="white" strokeWidth="1.6" />
                    <circle cx="17.6" cy="6.4" r="1.1" fill="white" />
                  </svg>
                  <span>JOCKEY</span>
                </span>

                <video
                  className="instagram-card__video"
                  src={reel.videoSrc}
                  poster={reel.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={index < 2 ? "auto" : "metadata"}
                  aria-label={reel.alt}
                />

                <span className="instagram-card__products" onClick={(e) => e.preventDefault()}>
                  <span className="instagram-card__thumbs">
                    {reel.products.map((product) => (
                      <img key={product.title} src={product.img} alt={product.title} title={`${product.title} — ${product.price}`} />
                    ))}
                  </span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M1 5L5 1L9 5" stroke="#301311" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            ))}
          </div>

          <button
            type="button"
            className="instagram-section__nav instagram-section__nav--next"
            aria-label="Next reels"
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

export default Instagram;