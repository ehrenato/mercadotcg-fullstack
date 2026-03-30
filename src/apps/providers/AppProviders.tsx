import type { ReactNode } from "react";
import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";
import { FavoritesProvider } from "../../context/FavoritesContext";
import { SearchProvider } from "../../context/SearchContext";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <SearchProvider>
        <FavoritesProvider>
          <CartProvider>{children}</CartProvider>
        </FavoritesProvider>
      </SearchProvider>
    </AuthProvider>
  );
}
