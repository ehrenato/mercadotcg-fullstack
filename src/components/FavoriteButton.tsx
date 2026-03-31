import { useFavorites } from "../context/FavoritesContext";
import type { Product } from "../services/api";

type FavoriteButtonProps = {
  product: Product;
};

export default function FavoriteButton({ product }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(product)}
      aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      title={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      {favorite ? "❤️" : "🤍"}
    </button>
  );
}