import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Product } from "@/types/product";

export interface CartItem {
  id: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  size?: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, size?: string, qty?: number) => void;
  removeItem: (id: number, size?: string) => void;
  updateQty: (id: number, size: string | undefined, qty: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "stylevin-cart";

const CartContext = createContext<CartContextValue | null>(null);

const sameLine = (a: CartItem, id: number, size?: string) =>
  a.id === id && a.size === size;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // load once on the client
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore corrupt / blocked storage */
    }
    setLoaded(true);
  }, []);

  // persist (only after the first load so we never overwrite saved data)
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, loaded]);

  const addItem = useCallback(
    (product: Product, size?: string, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => sameLine(i, product.id, size));
        if (existing) {
          return prev.map((i) =>
            sameLine(i, product.id, size) ? { ...i, qty: i.qty + qty } : i
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images[0],
            price: product.price,
            mrp: product.mrp,
            size,
            qty,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((id: number, size?: string) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, id, size)));
  }, []);

  const updateQty = useCallback(
    (id: number, size: string | undefined, qty: number) => {
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => !sameLine(i, id, size))
          : prev.map((i) => (sameLine(i, id, size) ? { ...i, qty } : i))
      );
    },
    []
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.qty, 0),
      addItem,
      removeItem,
      updateQty,
      clear,
    }),
    [items, addItem, removeItem, updateQty, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
