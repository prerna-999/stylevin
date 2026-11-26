import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Product } from "@/types/product";
import { getColorName } from "@/lib/colors";

export const MAX_QTY_PER_LINE = 10;

export interface CartItem {
  id: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  size?: string;
  /** swatch hex, e.g. "#301311" */
  color?: string;
  colorName?: string;
  qty: number;
  /** highest quantity the shopper may order for this line */
  maxQty?: number;
}

export interface AddItemOptions {
  size?: string;
  qty?: number;
  color?: string;
  colorName?: string;
  /** override the product image (e.g. the image of the chosen colour) */
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  /** total number of units in the cart (shown in the header) */
  count: number;
  subtotal: number;
  /** total MRP minus total price */
  savings: number;
  /** false until the saved cart has been read from storage */
  ready: boolean;
  addItem: (product: Product, opts?: AddItemOptions) => void;
  removeItem: (id: number, size?: string, color?: string) => void;
  updateQty: (
    id: number,
    size: string | undefined,
    color: string | undefined,
    qty: number
  ) => void;
  /** swap the size / colour of an existing line (merges into a matching line if one exists) */
  changeVariant: (
    product: Product,
    from: { size?: string; color?: string },
    to: { size?: string; color?: string }
  ) => void;
  clear: () => void;
  /** is this product (optionally this exact size / colour) in the cart? */
  isInCart: (id: number, size?: string, color?: string) => boolean;
}

const STORAGE_KEY = "stylevin-cart";

const CartContext = createContext<CartContextValue | null>(null);

const sameLine = (a: CartItem, id: number, size?: string, color?: string) =>
  a.id === id && a.size === size && a.color === color;

const readStorage = (): CartItem[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // load once on the client
  useEffect(() => {
    setItems(readStorage());
    setLoaded(true);
  }, []);

  // keep several open tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // persist (only after the first load so we never overwrite saved data)
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore blocked storage */
    }
  }, [items, loaded]);

  const addItem = useCallback(
    (product: Product, opts: AddItemOptions = {}) => {
      const { size, qty = 1, color, colorName, image } = opts;
      const stock = product.variants.find((v) => v.size === size)?.stock;
      const maxQty = Math.min(stock ?? MAX_QTY_PER_LINE, MAX_QTY_PER_LINE);

      setItems((prev) => {
        const existing = prev.find((i) =>
          sameLine(i, product.id, size, color)
        );
        if (existing) {
          return prev.map((i) =>
            sameLine(i, product.id, size, color)
              ? { ...i, qty: Math.min(i.qty + qty, maxQty), maxQty }
              : i
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: image ?? product.images[0],
            price: product.price,
            mrp: product.mrp,
            size,
            color,
            colorName: colorName ?? getColorName(color),
            qty: Math.min(qty, maxQty),
            maxQty,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback(
    (id: number, size?: string, color?: string) => {
      setItems((prev) => prev.filter((i) => !sameLine(i, id, size, color)));
    },
    []
  );

  const updateQty = useCallback(
    (id: number, size: string | undefined, color: string | undefined, qty: number) => {
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => !sameLine(i, id, size, color))
          : prev.map((i) =>
              sameLine(i, id, size, color)
                ? { ...i, qty: Math.min(qty, i.maxQty ?? MAX_QTY_PER_LINE) }
                : i
            )
      );
    },
    []
  );

  const changeVariant = useCallback(
    (
      product: Product,
      from: { size?: string; color?: string },
      to: { size?: string; color?: string }
    ) => {
      const stock = product.variants.find((v) => v.size === to.size)?.stock;
      const maxQty = Math.min(stock ?? MAX_QTY_PER_LINE, MAX_QTY_PER_LINE);
      setItems((prev) => {
        const old = prev.find((i) => sameLine(i, product.id, from.size, from.color));
        if (!old) return prev;
        const target = prev.find((i) => sameLine(i, product.id, to.size, to.color));
        if (target && target !== old) {
          // new combination already in the cart -> merge the quantities
          return prev
            .filter((i) => i !== old)
            .map((i) =>
              i === target
                ? { ...i, qty: Math.min(i.qty + old.qty, maxQty), maxQty }
                : i
            );
        }
        return prev.map((i) =>
          i === old
            ? {
                ...i,
                size: to.size,
                color: to.color,
                colorName: getColorName(to.color),
                qty: Math.min(i.qty, maxQty),
                maxQty,
              }
            : i
        );
      });
    },
    []
  );

  const clear = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (id: number, size?: string, color?: string) =>
      items.some(
        (i) =>
          i.id === id &&
          (size === undefined || i.size === size) &&
          (color === undefined || i.color === color)
      ),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.qty, 0),
      savings: items.reduce(
        (n, i) => n + Math.max(0, i.mrp - i.price) * i.qty,
        0
      ),
      ready: loaded,
      addItem,
      removeItem,
      updateQty,
      changeVariant,
      clear,
      isInCart,
    }),
    [items, loaded, addItem, removeItem, updateQty, changeVariant, clear, isInCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
