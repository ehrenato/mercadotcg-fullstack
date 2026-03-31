import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { useCart } from "../context/CartContext";
import type { Product } from "../services/api";

type ProductCardProps = {
  product: Product;
};

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

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <div className="product-card__favorite">
        <FavoriteButton product={product} />
      </div>

      <Link to={`/produto/${product.id}`} className="product-card__image-link">
        <img
          src={getImageSrc(product.image_url)}
          alt={product.title}
          className="product-card__image"
        />
      </Link>

      <div className="product-card__content">
        <span className="product-card__badge">{product.category}</span>

        <h3 className="product-card__title">{product.title}</h3>

        <div className="product-card__meta">
          <span>
            <strong>Idioma:</strong> {product.idioma}
          </span>
          <span>
            <strong>Qualidade:</strong> {product.qualidade}
          </span>
        </div>

        {product.extras ? (
          <p className="product-card__extras">{product.extras}</p>
        ) : null}

        <strong className="product-card__price">
          R$ {Number(product.price).toFixed(2)}
        </strong>

        {product.seller_name ? (
          <p className="product-card__seller">por {product.seller_name}</p>
        ) : null}

        <div className="product-card__actions">
          <Link to={`/produto/${product.id}`} className="product-card__link">
            Ver produto
          </Link>

          <button
            type="button"
            className="product-card__cart-button"
            onClick={() => addToCart(product)}
          >
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}