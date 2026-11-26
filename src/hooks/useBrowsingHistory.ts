import { useEffect, useState } from "react";

const STORAGE_KEY = "stylevin-recently-viewed";
const MAX_ITEMS = 20;

const read = (): number[] => {
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
};

/**
 * Records the current product as "viewed" and returns the shopper's
 * browsing history (most recent first), WITHOUT the current product.
 * Returns [] during SSR / first render so markup matches on hydration.
 */
export function useBrowsingHistory(currentId: number): number[] {
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    const previous = read().filter((id) => id !== currentId);
    setHistory(previous);
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([currentId, ...previous].slice(0, MAX_ITEMS))
      );
    } catch {
      /* ignore */
    }
  }, [currentId]);

  return history;
}
