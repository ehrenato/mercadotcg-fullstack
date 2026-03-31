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
      <Link to={`/produto/${product.id}`} className="product-card-image-link">
        <img
          src={getImageSrc(product.image_url)}
          alt={product.title}
          className="product-card-image"
        />
      </Link>

      <div className="product-card-body">
        <span className="product-category">{product.category}</span>

        <Link to={`/produto/${product.id}`} className="product-title-link">
          <h3>{product.title}</h3>
        </Link>

        <p className="product-qualidade">{product.qualidade}</p>

        <div className="product-meta">
          <strong>R$ {Number(product.price).toFixed(2)}</strong>
          {product.seller_name ? (
            <span className="product-seller">por {product.seller_name}</span>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link to={`/produto/${product.id}`} className="product-action">
            Ver produto
          </Link>

          <button type="button" onClick={() => addToCart(product)}>
            Carrinho
          </button>

          <FavoriteButton product={product} />
        </div>
      </div>
    </article>
  );
}