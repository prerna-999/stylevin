import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import CategoryBannerSlider, { BannerSlide } from "@/components/products/CategoryBannerSlider";
import ProductSidebar from "@/components/products/ProductSidebar";
import ProductFilters from "@/components/products/ProductFilters";
import ProductPagination from "@/components/products/ProductPagination";
import {
  COMBO_CATEGORIES,
  COMBO_DEALS,
  COMBO_SORT_OPTIONS,
  ComboSort,
  filterCombos,
  getComboColorOptions,
  getComboPriceBounds,
  getComboSizeOptions,
  getComboTypeOptions,
  isComboCategory,
  sortCombos,
} from "@/lib/combos";
import ComboCard from "./ComboCard";

const PAGE_SIZE = 12;
const BASE = "/combo-offers";

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

const ComboOffersPage: React.FC = () => {
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);

  /* Men / Women / Kids combo comes from the url: /combo-offers?category=men */
  const raw = router.query.category;
  const category = isComboCategory(raw) ? raw : undefined;

  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number] | null>(null);
  const [sort, setSort] = useState<ComboSort>("newest");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // a new category starts clean (types / sizes differ per category)
  useEffect(() => {
    setSizes([]);
    setColors([]);
    setTypes([]);
    setPrice(null);
    setPage(1);
  }, [category]);

  const inCategory = useMemo(
    () => (category ? COMBO_DEALS.filter((d) => d.category === category) : COMBO_DEALS),
    [category]
  );

  const priceBounds = useMemo(() => getComboPriceBounds(COMBO_DEALS), []);
  const sizeOptions = useMemo(() => getComboSizeOptions(inCategory), [inCategory]);
  const colorOptions = useMemo(() => getComboColorOptions(inCategory), [inCategory]);
  const typeOptions = useMemo(() => getComboTypeOptions(inCategory), [inCategory]);

  const priceRange: [number, number] = price ?? [priceBounds.min, priceBounds.max];
  const priceActive = price !== null && (price[0] > priceBounds.min || price[1] < priceBounds.max);

  const results = useMemo(
    () =>
      sortCombos(
        filterCombos(inCategory, { sizes, colors, types, price: priceRange }),
        sort
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inCategory, sizes, colors, types, priceRange[0], priceRange[1], sort]
  );

  const totalPages = Math.max(Math.ceil(results.length / PAGE_SIZE), 1);
  const currentPage = Math.min(page, totalPages);
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (p: number) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  const sortActive = sort !== "newest";
  const activeCount =
    sizes.length + colors.length + types.length + (priceActive ? 1 : 0) + (sortActive ? 1 : 0);

  const clearAll = () => {
    setSizes([]);
    setColors([]);
    setTypes([]);
    setPrice(null);
    setSort("newest");
    setPage(1);
  };

  const slides: BannerSlide[] = COMBO_CATEGORIES.map((c) => ({
    id: c.slug,
    href: `${BASE}?category=${c.slug}`,
    desktopImg: c.banner,
    mobileImg: c.banner,
    alt: c.label,
    label: c.label,
  }));

  const activeLabel = COMBO_CATEGORIES.find((c) => c.slug === category)?.label;

  const categoryLinks = (
    <ul className="product-sidebar__list">
      <li>
        <Link href={BASE} className={`product-sidebar__link ${!category ? "is-active" : ""}`}>
          All Combos
        </Link>
      </li>
      {COMBO_CATEGORIES.map((c) => (
        <li key={c.slug}>
          <Link
            href={`${BASE}?category=${c.slug}`}
            className={`product-sidebar__link ${category === c.slug ? "is-active" : ""}`}
          >
            {c.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <CategoryBannerSlider
        slides={slides}
        activeSlideId={category}
        label="Combo offers"
      />

      <section className="product-listing">
        <div className="product-listing__inner" ref={topRef}>
          <div className="product-listing__layout">
            <ProductSidebar
              categoryPanel={categoryLinks}
              sortOptions={COMBO_SORT_OPTIONS}
              extraFilter={{
                label: "Combo Type",
                options: typeOptions,
                selected: types,
                onToggle: (v) => {
                  setTypes((prev) => toggle(prev, v));
                  setPage(1);
                },
              }}
              sort={sort}
              onSortChange={(s) => {
                setSort(s as ComboSort);
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
              <div className="product-listing__toolbar">
                <nav className="category-pills" aria-label="Combo categories">
                  <Link href={BASE} className={`category-pills__pill ${!category ? "is-active" : ""}`}>
                    All
                  </Link>
                  {COMBO_CATEGORIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={`${BASE}?category=${c.slug}`}
                      className={`category-pills__pill ${category === c.slug ? "is-active" : ""}`}
                    >
                      {c.label}
                    </Link>
                  ))}
                </nav>

                <ProductFilters
                  unitLabel={["combo", "combos"]}
                  resultCount={results.length}
                  activeFilterCount={activeCount}
                  onOpenFilters={() => setDrawerOpen(true)}
                />
              </div>

              {visible.length === 0 ? (
                <p className="product-grid__empty">
                  {activeCount > 0
                    ? "No combos match these filters. Try clearing a few."
                    : `${activeLabel ?? "Combo"} offers are coming soon.`}
                </p>
              ) : (
                <div className="product-grid">
                  {visible.map((combo) => (
                    <ComboCard key={combo.id} combo={combo} />
                  ))}
                </div>
              )}

              <ProductPagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ComboOffersPage;
