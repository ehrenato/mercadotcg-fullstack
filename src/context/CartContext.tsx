import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../services/api";

export type CartItem = Product & {
  quantity: number;
};

type CartContextValue = {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
  totalItems: number;
  totalPrice: number;
};

const CART_STORAGE_KEY = "mercadotcg_cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

function getInitialCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product: Product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(productId: number) {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function increaseQuantity(productId: number) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(productId: number) {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  function isInCart(productId: number) {
    return cartItems.some((item) => item.id === productId);
  }

  function getItemQuantity(productId: number) {
    const item = cartItems.find((cartItem) => cartItem.id === productId);
    return item?.quantity ?? 0;
  }

  const totalItems = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + Number(item.price) * item.quantity,
        0
      ),
    [cartItems]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      isInCart,
      getItemQuantity,
      totalItems,
      totalPrice,
    }),
    [cartItems, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }

  return context;
}