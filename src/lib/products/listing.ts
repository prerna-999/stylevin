import { Product } from "@/types/product";

/* ---------- sort ---------- */
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function sortProducts(products: Product[], sort: SortValue): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "popularity":
      // no sales count in the data yet → review count is the best proxy
      return list.sort(
        (a, b) =>
          (b.reviewCount ?? 0) - (a.reviewCount ?? 0) ||
          (b.rating ?? 0) - (a.rating ?? 0)
      );
    case "newest":
    default:
      // flagged-new first, then higher id (added later) first
      return list.sort(
        (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.id - a.id
      );
  }
}

/* ---------- filter ---------- */
export interface ListingFilters {
  sizes: string[];
  colors: string[];
  price: [number, number];
}

export function filterProducts(
  products: Product[],
  { sizes, colors, price }: ListingFilters
): Product[] {
  return products.filter((p) => {
    if (p.price < price[0] || p.price > price[1]) return false;
    if (
      sizes.length &&
      !p.variants.some((v) => v.stock > 0 && sizes.includes(v.size))
    )
      return false;
    if (colors.length && !p.colors.some((c) => colors.includes(c)))
      return false;
    return true;
  });
}

/* ---------- options derived from the catalog ---------- */
const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];

export function getSizeOptions(products: Product[]): string[] {
  const set = new Set<string>();
  products.forEach((p) => p.variants.forEach((v) => set.add(v.size)));

  return Array.from(set).sort((a, b) => {
    const ia = SIZE_ORDER.indexOf(a.toUpperCase());
    const ib = SIZE_ORDER.indexOf(b.toUpperCase());
    if (ia !== -1 && ib !== -1) return ia - ib; // S < M < L …
    if (ia !== -1) return -1; // letter sizes before numeric
    if (ib !== -1) return 1;
    return a.localeCompare(b, undefined, { numeric: true }); // 28 < 30 < 32
  });
}

export function getColorOptions(products: Product[]): string[] {
  const set = new Set<string>();
  products.forEach((p) => p.colors.forEach((c) => set.add(c)));
  return Array.from(set);
}

export function getPriceBounds(products: Product[]): {
  min: number;
  max: number;
} {
  if (!products.length) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

/* ---------- helpers ---------- */
export const inStockSizes = (p: Product): string[] =>
  p.variants.filter((v) => v.stock > 0).map((v) => v.size);
