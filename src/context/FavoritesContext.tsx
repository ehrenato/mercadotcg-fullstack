import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types/Product";

type FavoritesContextValue = {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "mercadotcg:favorites";

type FavoritesProviderProps = {
  children: ReactNode;
};

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFavorites(JSON.parse(stored) as Product[]);
    }
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      toggleFavorite: (product: Product) => {
        setFavorites((current) => {
          const exists = current.some((item) => item.id === product.id);
          const next = exists
            ? current.filter((item) => item.id !== product.id)
            : [...current, product];

          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      },
      isFavorite: (id: number) => favorites.some((item) => item.id === id),
    }),
    [favorites],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }

  return context;
}
