import { useState } from "react";
import { useParams } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton";
import { useCart } from "../context/CartContext";
import { useProduct } from "../hooks/useProduct";

const API_ORIGIN = "http://localhost:3001";

function getImageSrc(imageUrl?: string | null) {
  if (!imageUrl) {
    return "https://via.placeholder.com/700x500?text=Sem+imagem";
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${API_ORIGIN}${imageUrl}`;
}

export default function ProductDetails() {
  const { id } = useParams();
  const numericId = Number(id);
  const product = useProduct(numericId);
  const { addToCart } = useCart();
  const [selectedImage] = useState(0);

  if (!product) {
    return <div>Carregando produto...</div>;
  }

  const gallery = product.image_url ? [product.image_url] : [];
  const activeImage = gallery[selectedImage] ?? product.image_url;

  return (
    <section className="product-details-page">
      <div className="product-details-grid">
        <div>
          <img
            src={getImageSrc(activeImage)}
            alt={product.title}
            style={{ width: "100%", maxWidth: 560, borderRadius: 16 }}
          />
        </div>

        <div>
          <span>{product.category}</span>
          <h1>{product.title}</h1>
          <p>R$ {Number(product.price).toFixed(2)}</p>
          <p>{product.description}</p>
          <p>Vendedor: {product.seller_name ?? "Loja oficial"}</p>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button type="button" onClick={() => addToCart(product)}>
              Adicionar ao carrinho
            </button>

            <FavoriteButton product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}