import { Product } from "@/types/product";

/**
 * Standard STYLEVIN size charts (garment measurements, in inches).
 * Replace these numbers with the real measurements from your supplier / Qikink
 * spec sheets — the page reads everything from here.
 */

export type SizeChartKind = "tops" | "bottoms" | "kids" | "one-size";

export interface SizeChart {
  kind: SizeChartKind;
  title: string;
  columns: string[]; // measurement names (excluding "Size")
  rows: { size: string; values: number[] }[]; // values in inches
  howToMeasure: { label: string; text: string }[];
  note?: string;
}

const TOPS: Record<string, number[]> = {
  // Chest, Length, Shoulder, Sleeve
  XS: [38, 26.5, 18.5, 8],
  S: [40, 27.5, 19.5, 8.5],
  M: [42, 28, 20.5, 9],
  L: [44, 28.5, 21.5, 9.5],
  XL: [46, 29, 22.5, 10],
  XXL: [48, 29.5, 23.5, 10.5],
  "3XL": [50, 30, 24.5, 11],
};

const BOTTOMS: Record<string, number[]> = {
  // Waist, Hip, Inseam, Outseam
  "26": [26, 36, 29, 38],
  "28": [28, 38, 29.5, 38.5],
  "30": [30, 40, 30, 39],
  "32": [32, 42, 30.5, 39.5],
  "34": [34, 44, 31, 40],
  "36": [36, 46, 31.5, 40.5],
  "38": [38, 48, 32, 41],
};

const KIDS: Record<string, number[]> = {
  // Height, Chest, Length
  "2-3Y": [37, 22, 15],
  "3-4Y": [40, 23, 16],
  "4-5Y": [43, 24, 17],
  "5-6Y": [46, 25, 18],
  "6-7Y": [48.5, 26, 19],
  "7-8Y": [51, 27, 20],
  "8-9Y": [53, 28, 21],
};

const TOP_TIPS = [
  { label: "Chest", text: "Measure across the fullest part of the chest, keeping the tape under the arms." },
  { label: "Length", text: "Measure from the highest point of the shoulder down to the hem." },
  { label: "Shoulder", text: "Measure from one shoulder seam to the other across the back." },
];

const BOTTOM_TIPS = [
  { label: "Waist", text: "Measure around your natural waistline, keeping the tape comfortably loose." },
  { label: "Hip", text: "Measure around the fullest part of your hips." },
  { label: "Inseam", text: "Measure from the crotch seam down to the bottom of the leg." },
];

const KID_TIPS = [
  { label: "Height", text: "Stand straight without shoes and measure from head to floor." },
  { label: "Chest", text: "Measure around the fullest part of the chest under the arms." },
];

const pick = (table: Record<string, number[]>, sizes: string[]) => {
  const rows = sizes
    .filter((s) => table[s])
    .map((s) => ({ size: s, values: table[s] }));
  // if the product has none of our sizes, fall back to the full table
  return rows.length
    ? rows
    : Object.entries(table).map(([size, values]) => ({ size, values }));
};

export function getSizeChart(product: Product): SizeChart {
  const sizes = product.variants.map((v) => v.size);
  const first = sizes[0] ?? "";

  if (sizes.length === 1 && /one\s*size/i.test(first)) {
    return {
      kind: "one-size",
      title: "One Size",
      columns: [],
      rows: [],
      howToMeasure: [],
      note: "This item comes in one size with an adjustable fit that suits most adults.",
    };
  }

  if (/^\d+\s*-\s*\d+\s*Y$/i.test(first)) {
    return {
      kind: "kids",
      title: "Kids Size Chart",
      columns: ["Height", "Chest", "Length"],
      rows: pick(KIDS, sizes),
      howToMeasure: KID_TIPS,
      note: "If your child is between sizes, we recommend choosing the bigger size.",
    };
  }

  if (/^\d+$/.test(first)) {
    return {
      kind: "bottoms",
      title: "Bottoms Size Chart",
      columns: ["Waist", "Hip", "Inseam", "Outseam"],
      rows: pick(BOTTOMS, sizes),
      howToMeasure: BOTTOM_TIPS,
    };
  }

  return {
    kind: "tops",
    title: "Topwear Size Chart",
    columns: ["Chest", "Length", "Shoulder", "Sleeve"],
    rows: pick(TOPS, sizes),
    howToMeasure: TOP_TIPS,
    note: "Garment measurements. For an oversized look, pick your usual size; for a regular fit, go one size down.",
  };
}

export const inchToCm = (n: number) => Math.round(n * 2.54 * 10) / 10;
