import React, { useEffect, useMemo, useRef, useState } from "react";
import { Product } from "@/types/product";
import { CategoryConfig } from "@/lib/categories";
import {
  SortValue,
  filterProducts,
  getColorOptions,
  getPriceBounds,
  getSizeOptions,
  sortProducts,
} from "@/lib/products/listing";
import CategoryPills from "./CategoryPills";
import ProductSidebar from "./ProductSidebar";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";
import ProductPagination from "./ProductPagination";

interface ProductListingProps {
  products: Product[];
  /** whole-category catalog: only the price range comes from here, so the Price filter is always usable. Sizes and colours come from `products` (the current subcategory). */
  priceSource?: Product[];
  categoryConfig: CategoryConfig;
  activeSubcategory?: string;
  pageSize?: number;
}

const ProductListing: React.FC<ProductListingProps> = ({
  products,
  priceSource,
  categoryConfig,
  activeSubcategory,
  pageSize = 12,
}) => {
  const topRef = useRef<HTMLDivElement>(null);

  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number] | null>(null);
  const [sort, setSort] = useState<SortValue>("newest");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* ---------- filter options come from the catalog itself ---------- */
  const priceBounds = useMemo(() => getPriceBounds(priceSource ?? products), [priceSource, products]);
  const sizeOptions = useMemo(() => getSizeOptions(products), [products]);
  const colorOptions = useMemo(() => getColorOptions(products), [products]);

  const priceRange: [number, number] = price ?? [
    priceBounds.min,
    priceBounds.max,
  ];
  const priceActive =
    price !== null &&
    (price[0] > priceBounds.min || price[1] < priceBounds.max);

  /* ---------- filter → sort ---------- */
  const results = useMemo(
    () =>
      sortProducts(
        filterProducts(products, { sizes, colors, price: priceRange }),
        sort
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, sizes, colors, priceRange[0], priceRange[1], sort]
  );

  /* ---------- pagination ---------- */
  const totalPages = Math.max(Math.ceil(results.length / pageSize), 1);
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visible = results.slice(start, start + pageSize);

  const goToPage = (p: number) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ---------- mobile drawer: lock page scroll, close on Esc ---------- */
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  /* ---------- handlers (every filter change goes back to page 1) ---------- */
  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  const sortActive = sort !== "newest";
  const activeCount =
    sizes.length + colors.length + (priceActive ? 1 : 0) + (sortActive ? 1 : 0);

  const clearAll = () => {
    setSizes([]);
    setColors([]);
    setPrice(null);
    setSort("newest");
    setPage(1);
  };

  return (
    <section className="product-listing">
      <div className="product-listing__inner" ref={topRef}>
        <div className="product-listing__layout">
          <ProductSidebar
            categoryConfig={categoryConfig}
            activeSubcategory={activeSubcategory}
            sort={sort}
            onSortChange={(s) => {
              setSort(s);
              setPage(1);
            }}
            sizeOptions={sizeOptions}
            selectedSizes={sizes}
            onToggleSize={(s) => {
              setSizes((prev) => toggle(prev, s));
              setPage(1);
            }}
            colorOptions={colorOptions}
            selectedColors={colors}
            onToggleColor={(c) => {
              setColors((prev) => toggle(prev, c));
              setPage(1);
            }}
            priceBounds={priceBounds}
            priceRange={priceRange}
            onPriceChange={(r) => {
              setPrice(r);
              setPage(1);
            }}
            activeCount={activeCount}
            onClearAll={clearAll}
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />

          <div className="product-listing__main">
            <CategoryPills
              categoryConfig={categoryConfig}
              activeSubcategory={activeSubcategory}
            />

            <ProductFilters
              sort={sort}
              onSortChange={(s) => {
                setSort(s);
                setPage(1);
              }}
              resultCount={results.length}
              activeFilterCount={activeCount}
              onOpenFilters={() => setDrawerOpen(true)}
            />

            <ProductGrid
              products={visible}
              emptyMessage={
                activeCount > 0
                  ? "No products match these filters. Try clearing a few."
                  : undefined
              }
            />

            <ProductPagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;
