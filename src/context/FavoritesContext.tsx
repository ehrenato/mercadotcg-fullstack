import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../services/api";

type FavoritesContextValue = {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
};

const FAVORITES_STORAGE_KEY = "mercadotcg_favorites";

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

type FavoritesProviderProps = {
  children: ReactNode;
};

function getInitialFavorites(): Product[] {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Product[]>(getInitialFavorites);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  function addFavorite(product: Product) {
    setFavorites((prev) => {
      const alreadyExists = prev.some((item) => item.id === product.id);
      return alreadyExists ? prev : [...prev, product];
    });
  }

  function removeFavorite(productId: number) {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  }

  function toggleFavorite(product: Product) {
    setFavorites((prev) => {
      const alreadyExists = prev.some((item) => item.id === product.id);

      if (alreadyExists) {
        return prev.filter((item) => item.id !== product.id);
      }

      return [...prev, product];
    });
  }

  function isFavorite(productId: number) {
    return favorites.some((item) => item.id === productId);
  }

  function clearFavorites() {
    setFavorites([]);
  }

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      clearFavorites,
    }),
    [favorites]
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
    throw new Error("useFavorites deve ser usado dentro de FavoritesProvider");
  }

  return context;
}