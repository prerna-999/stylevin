/** Friendly names for the swatch hex values used in the catalog. */
const COLOR_NAMES: Record<string, string> = {
  "#111111": "Black",
  "#243a5e": "Navy",
  "#301311": "Coffee Bean",
  "#4a3f35": "Espresso",
  "#6e6248": "Dark Khaki",
  "#6f8fa8": "Blue Mirage",
  "#755b0b": "Golden Olive",
  "#7fa8c9": "Blue Heaven",
  "#8a8478": "Moon Rock",
  "#ededed": "Light Grey",
  "#f2c94c": "Mustard",
  "#ffffff": "White",
  "#c9b79c": "Quail",
  "#c9b9d9": "Lilac Snow",
  "#e8e2d6": "Egret",
};

export const getColorName = (hex?: string): string | undefined =>
  hex ? COLOR_NAMES[hex.toLowerCase()] : undefined;
