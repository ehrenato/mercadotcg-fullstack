import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/Product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="card">
      <div className="card-media">
        <img src={product.image} alt={product.title} />
      </div>

      <div className="card-body">
        <div className="row-between gap-sm">
          <span className="badge">{product.category}</span>
          <FavoriteButton product={product} />
        </div>

        <h3>{product.title}</h3>
        <p className="muted">{product.description}</p>
        <strong>R$ {product.price.toFixed(2)}</strong>

        <div className="row gap-sm">
          <Link className="primary-button" to={`/produto/${product.id}`}>
            Ver produto
          </Link>
          <button
            type="button"
            className="secondary-button"
            onClick={() => addToCart(product)}
          >
            Carrinho
          </button>
        </div>
      </div>
    </article>
  );
}
