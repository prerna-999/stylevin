import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types/product";
import ProductCard from "@/components/products/ProductCard";

const WishlistMatches: React.FC<{ products: Product[] }> = ({ products }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  if (products.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="wl-matches" aria-label="From your wishlist">
      <div className="wl-matches__head">
        <h2>From your Wishlist</h2>
        <div className="wl-matches__nav">
          <button type="button" aria-label="Previous" onClick={() => scroll(-1)}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" aria-label="Next" onClick={() => scroll(1)}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="wl-matches__track" ref={trackRef}>
        {products.map((p) => (
          <div className="wl-matches__item" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default WishlistMatches;
