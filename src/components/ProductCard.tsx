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
      <div className="product-card-image-wrapper">
        <img
          src={getImageSrc(product.image_url)}
          alt={product.title}
          className="product-card-image"
        />
        <FavoriteButton product={product} />
      </div>

      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>

        <h3 className="product-card-title">{product.title}</h3>

        <p className="product-card-meta">
          {product.idioma} • {product.qualidade}
        </p>

        {product.extras ? (
          <p className="product-card-extras">{product.extras}</p>
        ) : null}

        <div className="product-card-footer">
          <div>
            <strong className="product-card-price">
              R$ {Number(product.price).toFixed(2)}
            </strong>

            {product.seller_name ? (
              <p className="product-card-seller">por {product.seller_name}</p>
            ) : null}
          </div>

          <div className="product-card-actions">
            <Link to={`/produto/${product.id}`} className="btn-secondary">
              Ver produto
            </Link>

            <button
              type="button"
              className="btn-primary"
              onClick={() => addToCart(product)}
            >
              Carrinho
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}