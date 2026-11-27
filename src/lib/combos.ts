import type { Product } from "@/types/product";

export interface ComboColor {
  name: string;
  hex: string;
}

export interface ComboItem {
  label: string;
  colors: ComboColor[];
  sizes: string[];
  unavailable?: string[];
}

export const COMBO_ID_BASE = 9000;

export const COLOR = {
  egret: { name: "Egret", hex: "#e8e2d6" },
  black: { name: "Black", hex: "#111111" },
  coffee: { name: "Coffee Bean", hex: "#301311" },
  moonRock: { name: "Moon Rock", hex: "#8a8478" },
  espresso: { name: "Espresso", hex: "#4a3f35" },
  navy: { name: "Navy", hex: "#243a5e" },
  khaki: { name: "Dark Khaki", hex: "#6e6248" },
  blueHeaven: { name: "Blue Heaven", hex: "#7fa8c9" },
  white: { name: "White", hex: "#ffffff" },
};

export const TOP_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const BOTTOM_SIZES = ["S", "M", "L", "XL", "XXL"];

export const COMBO_ITEMS: Record<number, ComboItem[]> = {
  1: [
    { label: "Tee", colors: [COLOR.egret, COLOR.coffee], sizes: TOP_SIZES, unavailable: ["XS"] },
    { label: "Cargo", colors: [COLOR.moonRock, COLOR.coffee], sizes: BOTTOM_SIZES },
  ],
  2: [
    { label: "Hoodie", colors: [COLOR.black, COLOR.espresso], sizes: TOP_SIZES, unavailable: ["XS"] },
    { label: "Joggers", colors: [COLOR.black, COLOR.navy], sizes: BOTTOM_SIZES },
  ],
  3: [
    { label: "Tee 1", colors: [COLOR.egret, COLOR.black], sizes: TOP_SIZES, unavailable: ["XS"] },
    { label: "Tee 2", colors: [COLOR.black, COLOR.moonRock], sizes: TOP_SIZES },
  ],
  4: [
    { label: "Cap", colors: [COLOR.white, COLOR.black], sizes: ["One Size"] },
    { label: "Tee", colors: [COLOR.egret, COLOR.black], sizes: TOP_SIZES, unavailable: ["XS"] },
  ],
};

const SHIRT_TROUSER: ComboItem[] = [
  { label: "Shirt", colors: [COLOR.blueHeaven, COLOR.black, COLOR.egret], sizes: TOP_SIZES, unavailable: ["XS"] },
  { label: "Trouser", colors: [COLOR.khaki, COLOR.black, COLOR.moonRock], sizes: BOTTOM_SIZES },
];
[5, 6, 7, 8].forEach((id) => {
  COMBO_ITEMS[id] = SHIRT_TROUSER;
});

/** cart product id -> combo items (undefined when the line is not a combo) */
export const getComboItems = (productId: number): ComboItem[] | undefined =>
  productId >= COMBO_ID_BASE ? COMBO_ITEMS[productId - COMBO_ID_BASE] : undefined;

/** the 3 strings a combo cart line is stored with */
export const buildComboKeys = (
  items: ComboItem[],
  colorIdx: number[],
  sizes: (string | null | undefined)[]
) => {
  const size = items.map((it, i) => `${it.label} ${sizes[i]}`).join(" · ");
  const color = `linear-gradient(90deg, ${items
    .map((it, i) => {
      const hex = it.colors[colorIdx[i] ?? 0].hex;
      return `${hex} ${(i * 100) / items.length}% ${((i + 1) * 100) / items.length}%`;
    })
    .join(", ")})`;
  const colorName = items
    .map((it, i) => `${it.label} ${it.colors[colorIdx[i] ?? 0].name}`)
    .join(" · ");
  return { size, color, colorName };
};

/** read size + colour of each item back out of an existing cart line */
export const parseComboLine = (
  items: ComboItem[],
  sizeKey?: string,
  colorNameKey?: string
) => {
  const sizeParts = (sizeKey ?? "").split(" · ");
  const colorParts = (colorNameKey ?? "").split(" · ");
  const sizes = items.map((it, i) => {
    const part = sizeParts.find((p) => p.startsWith(`${it.label} `)) ?? sizeParts[i];
    const s = part?.startsWith(`${it.label} `) ? part.slice(it.label.length + 1) : null;
    return s && it.sizes.includes(s) ? s : null;
  });
  const colorIdx = items.map((it, i) => {
    const part = colorParts.find((p) => p.startsWith(`${it.label} `)) ?? colorParts[i];
    const name = part?.startsWith(`${it.label} `) ? part.slice(it.label.length + 1) : "";
    const idx = it.colors.findIndex((c) => c.name === name);
    return idx >= 0 ? idx : 0;
  });
  return { sizes, colorIdx };
};

/* ------------------------------------------------------------------ */
/*  Combo offers: listing page (/combo-offers) + single page            */
/*  (/combo-offers/<slug>). Add a new combo = add one object below +    */
/*  its items in COMBO_ITEMS above (same id).                           */
/* ------------------------------------------------------------------ */

export type ComboCategorySlug = "men" | "women" | "kids";

export const COMBO_CATEGORIES: {
  slug: ComboCategorySlug;
  label: string;
  /** banner image on top of /combo-offers */
  banner: string;
}[] = [
  { slug: "men", label: "Men Combo", banner: "/assets/img/all-images/categories_banner/men.png" },
  { slug: "women", label: "Women Combo", banner: "/assets/img/all-images/categories_banner/shirts.png" },
  { slug: "kids", label: "Kids Combo", banner: "/assets/img/all-images/categories_banner/tshirts.png" },
];

export const isComboCategory = (v: unknown): v is ComboCategorySlug =>
  COMBO_CATEGORIES.some((c) => c.slug === v);

export interface ComboDeal {
  /** must match the key used in COMBO_ITEMS */
  id: number;
  /** url part: /combo-offers/<slug> */
  slug: string;
  title: string;
  /** Men Combo / Women Combo / Kids Combo (a COMBO_CATEGORIES slug) */
  category: ComboCategorySlug;
  /** combo type shown in the "Combo Type" filter, e.g. "Tee + Cargo" */
  type: string;
  price: number;
  mrp: number;
  images: string[];
  alt: string;
  description: string;
}

const IMG = "/assets/img/all-images/home";

export const COMBO_DEALS: ComboDeal[] = [
  {
    id: 1,
    slug: "tee-cargo-combo",
    title: "Tee + Cargo Combo",
    type: "Tee + Cargo",
    category: "men",
    price: 1999,
    mrp: 2798,
    images: [`${IMG}/combo1.webp`],
    alt: "Oversized tee and cargo pants combo",
    description:
      "An oversized tee paired with relaxed cargo pants - pick your colour and size for each piece and save more than buying them separately.",
  },
  {
    id: 2,
    slug: "hoodie-joggers-combo",
    title: "Hoodie + Joggers",
    type: "Hoodie + Joggers",
    category: "men",
    price: 2499,
    mrp: 3398,
    images: [`${IMG}/combo2.webp`],
    alt: "Hoodie and joggers combo",
    description:
      "A cosy hoodie with matching joggers - the easiest everyday set for cooler days. Choose colour and size for each piece.",
  },
  {
    id: 3,
    slug: "graphic-duo-combo",
    title: "Graphic Duo",
    type: "Graphic Duo",
    category: "men",
    price: 1499,
    mrp: 1998,
    images: [`${IMG}/combo3.webp`],
    alt: "Two graphic printed tees combo",
    description:
      "Two graphic printed tees at one special price. Mix and match colours and sizes for each tee.",
  },
  {
    id: 4,
    slug: "cap-tee-combo",
    title: "Cap + Tee Combo",
    type: "Cap + Tee",
    category: "men",
    price: 1299,
    mrp: 1698,
    images: [`${IMG}/combo1.webp`],
    alt: "Cap and tee combo",
    description:
      "A cap and a tee that go together - finish the look for less. Pick the colour of each piece and your tee size.",
  },
  ...[
    { id: 5, image: "combo2.webp" },
    { id: 6, image: "combo3.webp" },
    { id: 7, image: "combo1.webp" },
    { id: 8, image: "combo2.webp" },
  ].map(
    ({ id, image }): ComboDeal => ({
      id,
      slug: id === 5 ? "shirt-trouser-combo" : `shirt-trouser-combo-${id - 4}`,
      title: "Shirt + Trouser",
      type: "Shirt + Trouser",
      category: "men",
      price: 2199,
      mrp: 2998,
      images: [`${IMG}/${image}`],
      alt: "Shirt and trouser combo",
      description:
        "A smart shirt with tailored trousers for work or a night out. Choose colour and size for each piece.",
    })
  ),
];

export const getComboBySlug = (slug: string): ComboDeal | undefined =>
  COMBO_DEALS.find((c) => c.slug === slug);

export const getComboById = (id: number): ComboDeal | undefined =>
  COMBO_DEALS.find((c) => c.id === id);

export const comboHref = (slug: string) => `/combo-offers/${slug}`;

/** page of a combo from its home-carousel id, or from its cart product id (9000 + id) */
export const comboHrefById = (id: number) => {
  const combo = getComboById(id >= COMBO_ID_BASE ? id - COMBO_ID_BASE : id);
  return combo ? comboHref(combo.slug) : "/combo-offers";
};

export const comboDiscount = (c: Pick<ComboDeal, "price" | "mrp">) =>
  c.mrp > c.price ? Math.round(((c.mrp - c.price) / c.mrp) * 100) : 0;

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** a combo goes into the cart like a product: id 9000 + combo id, slug "combo-<id>" */
export const comboToProduct = (c: ComboDeal): Product => ({
  id: COMBO_ID_BASE + c.id,
  slug: `combo-${c.id}`,
  name: c.title,
  description: c.description,
  category: "combo",
  subcategory: "combo",
  price: c.price,
  mrp: c.mrp,
  images: [c.images[0]],
  variants: [],
  colors: [],
});

/* ---------- listing: sort / filter / filter options ---------- */

export const COMBO_SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "popularity", label: "Biggest Savings" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

export type ComboSort = (typeof COMBO_SORT_OPTIONS)[number]["value"];

export const sortCombos = (list: ComboDeal[], sort: ComboSort) => {
  const out = [...list];
  switch (sort) {
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    case "popularity":
      return out.sort((a, b) => comboDiscount(b) - comboDiscount(a));
    default:
      return out.sort((a, b) => b.id - a.id);
  }
};

const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];

export const getComboSizeOptions = (deals: ComboDeal[]): string[] => {
  const set = new Set<string>();
  deals.forEach((d) =>
    (COMBO_ITEMS[d.id] ?? []).forEach((it) =>
      it.sizes.forEach((s) => {
        if (!it.unavailable?.includes(s)) set.add(s);
      })
    )
  );
  const rank = (s: string) => {
    const i = SIZE_ORDER.indexOf(s.toUpperCase());
    return i === -1 ? 99 : i;
  };
  return Array.from(set).sort((a, b) => rank(a) - rank(b));
};

export const getComboColorOptions = (deals: ComboDeal[]): string[] => {
  const set = new Set<string>();
  deals.forEach((d) =>
    (COMBO_ITEMS[d.id] ?? []).forEach((it) => it.colors.forEach((c) => set.add(c.hex)))
  );
  return Array.from(set);
};

export const getComboTypeOptions = (deals: ComboDeal[]): string[] =>
  Array.from(new Set(deals.map((d) => d.type)));

export const getComboPriceBounds = (deals: ComboDeal[]) => {
  if (!deals.length) return { min: 0, max: 0 };
  const prices = deals.map((d) => d.price);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
};

export const filterCombos = (
  deals: ComboDeal[],
  f: { sizes: string[]; colors: string[]; types: string[]; price: [number, number] }
) =>
  deals.filter((d) => {
    if (d.price < f.price[0] || d.price > f.price[1]) return false;
    if (f.types.length && !f.types.includes(d.type)) return false;
    const items = COMBO_ITEMS[d.id] ?? [];
    if (
      f.sizes.length &&
      !items.some((it) => it.sizes.some((s) => f.sizes.includes(s) && !it.unavailable?.includes(s)))
    )
      return false;
    if (f.colors.length && !items.some((it) => it.colors.some((c) => f.colors.includes(c.hex))))
      return false;
    return true;
  });
