import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import "../styles/Favorites.css";

const API_ORIGIN = "http://localhost:3001";

function getImageSrc(imageUrl?: string | null) {
  if (!imageUrl) {
    return "https://via.placeholder.com/500x350?text=Sem+imagem";
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${API_ORIGIN}${imageUrl}`;
}

export default function Favorites() {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();

  return (
    <section className="favorites-page">
      <div className="favorites-page__header">
        <div>
          <h1>Favoritos</h1>
          <p>Seus produtos salvos aparecem aqui.</p>
        </div>

        {favorites.length > 0 ? (
          <button className="secondary-button" onClick={clearFavorites}>
            Limpar favoritos
          </button>
        ) : null}
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <h2>Nenhum favorito ainda</h2>
          <p>Salve anúncios para acompanhar depois.</p>
          <Link to="/" className="primary-button">
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((product) => (
            <article key={product.id} className="favorite-card">
              <Link to={`/produto/${product.id}`} className="favorite-card__image-link">
                <img
                  className="favorite-card__image"
                  src={getImageSrc(product.image_url)}
                  alt={product.title}
                />
              </Link>

              <div className="favorite-card__body">
                <span className="favorite-card__badge">{product.category}</span>
                <h3>{product.title}</h3>
                <p>{product.description}</p>

                <div className="favorite-card__footer">
                  <strong>R$ {Number(product.price).toFixed(2)}</strong>

                  <div className="favorite-card__actions">
                    <Link to={`/produto/${product.id}`} className="ghost-button">
                      Ver produto
                    </Link>

                    <button
                      className="secondary-button"
                      onClick={() => toggleFavorite(product)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}