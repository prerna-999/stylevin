import React, { useState } from "react";
import Link from "next/link";
import { FiSliders, FiX } from "react-icons/fi";
import { CategoryConfig } from "@/lib/categories";
import { SORT_OPTIONS, SortValue } from "@/lib/products/listing";

interface ProductSidebarProps {
  categoryConfig?: CategoryConfig;
  activeSubcategory?: string;
  /** replaces the content of the Category tab (combos use this) */
  categoryPanel?: React.ReactNode;
  /** custom sort list (combos have no ratings) */
  sortOptions?: readonly { value: SortValue; label: string }[];
  /** one more checkbox filter shown as an extra tab (e.g. combo type) */
  extraFilter?: {
    label: string;
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
  };

  sort: SortValue;
  onSortChange: (sort: SortValue) => void;

  sizeOptions: string[];
  selectedSizes: string[];
  onToggleSize: (size: string) => void;

  colorOptions: string[]; // hex values
  selectedColors: string[];
  onToggleColor: (hex: string) => void;

  priceBounds: { min: number; max: number };
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;

  activeCount: number;
  onClearAll: () => void;

  isOpen: boolean; // drawer
  onClose: () => void;
}

type Tab = "sort" | "size" | "price" | "category" | "color" | "extra";

/** Exact order: Sort By · Size · Price · Category · Color */
const TABS: { id: Tab; label: string }[] = [
  { id: "sort", label: "Sort By" },
  { id: "size", label: "Size" },
  { id: "price", label: "Price" },
  { id: "category", label: "Category" },
  { id: "color", label: "Color" },
];

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  categoryConfig,
  activeSubcategory,
  categoryPanel,
  sortOptions = SORT_OPTIONS,
  extraFilter,
  sort,
  onSortChange,
  sizeOptions,
  selectedSizes,
  onToggleSize,
  colorOptions,
  selectedColors,
  onToggleColor,
  priceBounds,
  priceRange,
  onPriceChange,
  activeCount,
  onClearAll,
  isOpen,
  onClose,
}) => {
  const [tab, setTab] = useState<Tab>("sort");
  const tabs = extraFilter
    ? [...TABS, { id: "extra" as Tab, label: extraFilter.label }]
    : TABS;

  const [minVal, maxVal] = priceRange;
  const span = Math.max(priceBounds.max - priceBounds.min, 1);
  const leftPct = ((minVal - priceBounds.min) / span) * 100;
  const rightPct = 100 - ((maxVal - priceBounds.min) / span) * 100;

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const priceText = `${fmt(minVal)} - ${fmt(maxVal)}${
    maxVal >= priceBounds.max ? "+" : ""
  }`;

  const setMin = (v: number) =>
    onPriceChange([Math.min(Math.max(v, priceBounds.min), maxVal), maxVal]);
  const setMax = (v: number) =>
    onPriceChange([minVal, Math.max(Math.min(v, priceBounds.max), minVal)]);

  /* small dot on a tab when something in it is applied */
  const tabActive: Record<Tab, boolean> = {
    sort: sort !== "newest",
    size: selectedSizes.length > 0,
    price: minVal > priceBounds.min || maxVal < priceBounds.max,
    category: false,
    color: selectedColors.length > 0,
    extra: (extraFilter?.selected.length ?? 0) > 0,
  };

  return (
    <>
      <div
        className={`product-sidebar__overlay ${isOpen ? "is-open" : ""}`}
        onClick={onClose}
      />

      <aside
        className={`product-sidebar ${isOpen ? "is-open" : ""}`}
        aria-label="Product filters"
      >
        <div className="product-sidebar__head">
          <h3 className="product-sidebar__title">
            <FiSliders /> Filter
            {activeCount > 0 && (
              <span className="product-sidebar__title-count">
                ({activeCount})
              </span>
            )}
          </h3>
          <div className="product-sidebar__head-actions">
            <button
              type="button"
              className="product-sidebar__clear"
              onClick={onClearAll}
              disabled={activeCount === 0}
            >
              Clear All
            </button>
            <button
              type="button"
              className="product-sidebar__close"
              onClick={onClose}
              aria-label="Close filters"
            >
              <FiX />
            </button>
          </div>
        </div>

        <div className="product-sidebar__body">
          {/* ---------- left: filter names ---------- */}
          <div className="product-sidebar__tabs" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`product-sidebar__tab ${
                  tab === t.id ? "is-active" : ""
                }`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                {tabActive[t.id] && (
                  <span className="product-sidebar__tab-dot" />
                )}
              </button>
            ))}
          </div>

          {/* ---------- right: options of the selected filter ---------- */}
          <div className="product-sidebar__panel" role="tabpanel">
            {tab === "sort" && (
              <ul className="product-sidebar__list">
                {sortOptions.map((opt) => (
                  <li key={opt.value}>
                    <label className="product-sidebar__check">
                      <input
                        type="checkbox"
                        checked={sort === opt.value}
                        onChange={() => onSortChange(opt.value)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}

            {tab === "size" &&
              (sizeOptions.length > 0 ? (
                <ul className="product-sidebar__list">
                  {sizeOptions.map((size) => (
                    <li key={size}>
                      <label className="product-sidebar__check">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => onToggleSize(size)}
                        />
                        <span>{size}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="product-sidebar__empty">No sizes available</p>
              ))}

            {tab === "price" && (
              <div>
                <div className="product-sidebar__range">
                  <div className="product-sidebar__range-track" />
                  <div
                    className="product-sidebar__range-fill"
                    style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
                  />
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={minVal}
                    onChange={(e) => setMin(Number(e.target.value))}
                    aria-label="Minimum price"
                  />
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={maxVal}
                    onChange={(e) => setMax(Number(e.target.value))}
                    aria-label="Maximum price"
                  />
                </div>
                <p className="product-sidebar__price-text">{priceText}</p>
              </div>
            )}

            {tab === "extra" && extraFilter && (
              <ul className="product-sidebar__list">
                {extraFilter.options.map((opt) => (
                  <li key={opt}>
                    <label className="product-sidebar__check">
                      <input
                        type="checkbox"
                        checked={extraFilter.selected.includes(opt)}
                        onChange={() => extraFilter.onToggle(opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}

            {tab === "category" && categoryPanel}

            {tab === "category" && !categoryPanel && categoryConfig && (
              <ul className="product-sidebar__list">
                <li>
                  <Link
                    href={`/${categoryConfig.slug}`}
                    className={`product-sidebar__link ${
                      !activeSubcategory ? "is-active" : ""
                    }`}
                  >
                    All {categoryConfig.label}
                  </Link>
                </li>
                {categoryConfig.subcategories.map((sub) => (
                  <li key={sub.slug}>
                    <Link
                      href={`/${categoryConfig.slug}/${sub.slug}`}
                      className={`product-sidebar__link ${
                        activeSubcategory === sub.slug ? "is-active" : ""
                      }`}
                    >
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {tab === "color" &&
              (colorOptions.length > 0 ? (
                <div className="product-sidebar__colors">
                  {colorOptions.map((hex) => {
                    const active = selectedColors.includes(hex);
                    return (
                      <button
                        key={hex}
                        type="button"
                        className={`product-sidebar__color ${
                          active ? "is-active" : ""
                        }`}
                        style={{ background: hex }}
                        aria-label={`Colour ${hex}`}
                        aria-pressed={active}
                        title={hex}
                        onClick={() => onToggleColor(hex)}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="product-sidebar__empty">No colours available</p>
              ))}
          </div>
        </div>

        <button
          type="button"
          className="product-sidebar__apply"
          onClick={onClose}
        >
          Show results
        </button>
      </aside>
    </>
  );
};

export default ProductSidebar;
