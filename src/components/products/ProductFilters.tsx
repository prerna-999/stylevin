import React from "react";
import { CategoryConfig } from "@/lib/categories";

interface ProductFiltersProps {
  categoryConfig?: CategoryConfig;
  activeSubcategory?: string;
  onSubcategoryChange: (slug: string | undefined) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  resultCount: number;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categoryConfig,
  activeSubcategory,
  onSubcategoryChange,
  sort,
  onSortChange,
  resultCount,
}) => {
  return (
    <div className="product-filters">
      <div className="product-filters__pills">
        <button
          type="button"
          className={`product-filters__pill ${
            !activeSubcategory ? "is-active" : ""
          }`}
          onClick={() => onSubcategoryChange(undefined)}
        >
          All
        </button>
        {categoryConfig?.subcategories.map((sub) => (
          <button
            key={sub.slug}
            type="button"
            className={`product-filters__pill ${
              activeSubcategory === sub.slug ? "is-active" : ""
            }`}
            onClick={() => onSubcategoryChange(sub.slug)}
          >
            {sub.label}
          </button>
        ))}
      </div>

      <div className="product-filters__meta">
        <span className="product-filters__count">
          {resultCount} {resultCount === 1 ? "product" : "products"}
        </span>

        <select
          className="product-filters__sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;