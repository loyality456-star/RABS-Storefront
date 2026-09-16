"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { shippingForQuantity, orderTotal, PLATFORM_FEE } from "@/lib/shipping";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  fee: number;
  total: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "rabs-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add = useCallback((line: Omit<CartLine, "quantity">, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === line.productId);
      if (existing) {
        return prev.map((l) =>
          l.productId === line.productId
            ? { ...l, quantity: l.quantity + qty }
            : l
        );
      }
      return [...prev, { ...line, quantity: qty }];
    });
    setDrawerOpen(true);
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) =>
            l.productId === productId ? { ...l, quantity } : l
          )
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const { count, subtotal, shipping, fee, total } = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
    const shipping = shippingForQuantity(count);
    return { count, subtotal, shipping, fee: PLATFORM_FEE, total: orderTotal(subtotal, count) };
  }, [lines]);

  const value = useMemo(
    () => ({
      lines,
      count,
      subtotal,
      shipping,
      fee,
      total,
      drawerOpen,
      setDrawerOpen,
      add,
      remove,
      setQuantity,
      clear,
    }),
    [lines, count, subtotal, shipping, fee, total, drawerOpen, add, remove, setQuantity, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}