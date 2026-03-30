import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <main className="container grid gap-md">
      <div>
        <h1>Favoritos</h1>
        <p className="muted">Seus produtos salvos aparecem aqui.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="card grid gap-sm">
          <p>Nenhum favorito ainda.</p>
          <Link className="primary-button" to="/">
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
