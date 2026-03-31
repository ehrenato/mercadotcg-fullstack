import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <section className="favorites-page">
      <header className="favorites-page__header">
        <h1>Favoritos</h1>
        <p>Seus produtos salvos aparecem aqui.</p>
      </header>

      {favorites.length === 0 ? (
        <div className="favorites-page__empty">
          <p>Nenhum favorito ainda.</p>
          <Link to="/">Explorar produtos</Link>
        </div>
      ) : (
        <div className="products-grid">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}