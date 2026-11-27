import React, { useEffect, useRef } from "react";
import { FiSliders } from "react-icons/fi";

interface ProductFiltersProps {
  resultCount: number;
  activeFilterCount: number;
  onOpenFilters: () => void; // opens the sidebar drawer on tablet / mobile
  /** [singular, plural] word after the count, default product / products */
  unitLabel?: [string, string];
}

/** Top toolbar: mobile "Filters" button · result count */
const ProductFilters: React.FC<ProductFiltersProps> = ({
  resultCount,
  activeFilterCount,
  onOpenFilters,
  unitLabel = ["product", "products"],
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toolbar = rootRef.current?.parentElement;
    if (!toolbar) return;
    const update = () =>
      toolbar.classList.toggle(
        "is-stuck",
        toolbar.getBoundingClientRect().top < 1
      );
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      toolbar.classList.remove("is-stuck");
    };
  }, []);

  return (
    <div className="product-filters" ref={rootRef}>
      <button
        type="button"
        className="product-filters__toggle"
        onClick={onOpenFilters}
      >
        <FiSliders />
        Filters
        {activeFilterCount > 0 && (
          <span className="product-filters__toggle-count">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* <span className="product-filters__count">
        {resultCount} {resultCount === 1 ? unitLabel[0] : unitLabel[1]}
      </span> */}
    </div>
  );
};

export default ProductFilters;
