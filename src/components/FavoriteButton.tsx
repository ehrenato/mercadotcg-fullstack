import { useFavorites } from "../context/FavoritesContext";
import type { Product } from "../types/Product";

type FavoriteButtonProps = {
  product: Product;
};

export default function FavoriteButton({ product }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <button
      type="button"
      className="ghost-button"
      onClick={() => toggleFavorite(product)}
      aria-label="Adicionar aos favoritos"
    >
      {isFavorite(product.id) ? "❤️" : "🤍"}
    </button>
  );
}
