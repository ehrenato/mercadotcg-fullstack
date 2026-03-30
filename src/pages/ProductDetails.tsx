import { useState } from "react";
import { useParams } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton";
import { useCart } from "../context/CartContext";
import { useProduct } from "../hooks/useProduct";

export default function ProductDetails() {
  const { id } = useParams();
  const numericId = Number(id);
  const product = useProduct(numericId);
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return <main className="container page-state">Carregando produto...</main>;
  }

  const gallery = product.images?.length ? product.images : [product.image];
  const activeImage = gallery[selectedImage] ?? product.image;

  return (
    <main className="container product-layout">
      <section className="card">
        <img src={activeImage} alt={product.title} className="product-hero" />

        <div className="row gap-sm wrap">
          {gallery.map((image, index) => (
            <button
              key={`${product.id}-${index}`}
              type="button"
              className="thumbnail-button"
              onClick={() => setSelectedImage(index)}
            >
              <img src={image} alt={`${product.title} ${index + 1}`} />
            </button>
          ))}
        </div>
      </section>

      <section className="card grid gap-md">
        <div className="row-between wrap gap-sm">
          <span className="badge">{product.category}</span>
          <FavoriteButton product={product} />
        </div>

        <h1>{product.title}</h1>
        <strong className="price-xl">R$ {product.price.toFixed(2)}</strong>
        <p>{product.description}</p>

        <div className="grid gap-xs">
          <span className="muted">Vendedor: {product.seller ?? "Loja oficial"}</span>
          <span className="muted">Condição: {product.condition ?? "Excelente"}</span>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => addToCart(product)}
        >
          Adicionar ao carrinho
        </button>
      </section>
    </main>
  );
}
