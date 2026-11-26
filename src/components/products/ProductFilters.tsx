import React from "react";
import { FiSliders } from "react-icons/fi";
import { SORT_OPTIONS, SortValue } from "@/lib/products/listing";

interface ProductFiltersProps {
  sort: SortValue;
  onSortChange: (sort: SortValue) => void;
  resultCount: number;
  activeFilterCount: number;
  onOpenFilters: () => void; // opens the sidebar drawer on tablet / mobile
}

/** Top toolbar: mobile "Filters" button · result count · sort dropdown */
const ProductFilters: React.FC<ProductFiltersProps> = ({
  sort,
  onSortChange,
  resultCount,
  activeFilterCount,
  onOpenFilters,
}) => {
  return (
    <div className="product-filters">
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

      <span className="product-filters__count">
        {resultCount} {resultCount === 1 ? "product" : "products"}
      </span>

      <label className="product-filters__sort-wrap">
        <span className="product-filters__sort-label">Sort by</span>
        <select
          className="product-filters__sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortValue)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default ProductFilters;
