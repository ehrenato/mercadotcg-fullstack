import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById, type Product } from "../services/api";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import "../styles/ProductPage.css";

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

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          throw new Error("Produto inválido.");
        }

        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar produto.");
      } finally {
        setLoading(false);
      }
    }

    void loadProduct();
  }, [id]);

  const isFavorite = useMemo(() => {
    if (!product) return false;
    return favorites.some((item) => item.id === product.id);
  }, [favorites, product]);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 1800);
  }

  function handleAddToCart() {
    if (!product) return;
    addToCart(product);
    showFeedback("Produto adicionado ao carrinho.");
  }

  function handleToggleFavorite() {
    if (!product) return;
    toggleFavorite(product);
    showFeedback(
      isFavorite
        ? "Produto removido dos favoritos."
        : "Produto adicionado aos favoritos."
    );
  }

  if (loading) {
    return (
      <section className="product-page-state">
        <p>Carregando produto...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="product-page-state">
        <h2>Não foi possível carregar o produto</h2>
        <p>{error}</p>
        <Link to="/" className="primary-button">
          Voltar para a Home
        </Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-page-state">
        <h2>Produto não encontrado</h2>
        <p>O anúncio solicitado não existe ou foi removido.</p>
        <Link to="/" className="primary-button">
          Voltar para a Home
        </Link>
      </section>
    );
  }

  return (
    <section className="product-page">
      <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <strong>{product.title}</strong>
      </div>

      {feedback && <div className="product-feedback">{feedback}</div>}

      <div className="product-page__grid">
        <div className="product-gallery-card">
          <img
            className="product-gallery-card__image"
            src={getImageSrc(product.image_url)}
            alt={product.title}
          />
        </div>

        <aside className="product-info-card">
          <span className="product-info-card__badge">{product.category}</span>

          <h1>{product.title}</h1>

          <p className="product-info-card__seller">
            Vendido por {product.seller_name || "Vendedor da plataforma"}
          </p>

          <div className="product-info-card__price">
            R$ {Number(product.price).toFixed(2)}
          </div>

          <p className="product-info-card__installments">
            em até 12x no cartão
          </p>

          <div className="product-info-card__actions">
            <button className="primary-button" onClick={handleAddToCart}>
              Adicionar ao carrinho
            </button>

            <button className="secondary-button" onClick={handleToggleFavorite}>
              {isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            </button>

            <button
              className="ghost-button"
              onClick={() => navigate("/carrinho")}
            >
              Ir para o carrinho
            </button>
          </div>
        </aside>
      </div>

      <div className="product-description-card">
        <h3>Descrição</h3>
        <p>{product.description}</p>
      </div>
    </section>
  );
}