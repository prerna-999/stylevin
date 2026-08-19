export interface CategoryConfig {
  slug: string;
  label: string;
  subcategories: { slug: string; label: string }[];
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "men",
    label: "Men",
    subcategories: [
      { slug: "shirts", label: "Shirts" },
      { slug: "t-shirts", label: "T-Shirts" },
      { slug: "jeans", label: "Jeans" },
      { slug: "jackets", label: "Jackets" },
    ],
  },
  {
    slug: "women",
    label: "Women",
    subcategories: [
      { slug: "dresses", label: "Dresses" },
      { slug: "tops", label: "Tops" },
      { slug: "skirts", label: "Skirts" },
      { slug: "ethnic-wear", label: "Ethnic Wear" },
    ],
  },
  {
    slug: "kids",
    label: "Kids",
    subcategories: [
      { slug: "boys", label: "Boys" },
      { slug: "girls", label: "Girls" },
      { slug: "infants", label: "Infants" },
    ],
  },
  {
    slug: "accessories",
    label: "Accessories",
    subcategories: [
      { slug: "bags", label: "Bags" },
      { slug: "watches", label: "Watches" },
      { slug: "jewellery", label: "Jewellery" },
      { slug: "belts", label: "Belts" },
    ],
  },
];

export function getCategoryConfig(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}