import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById, type Product } from "../services/api";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import "./styles/ProductPage.css";

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

    loadProduct();
  }, [id]);

  const isFavorite = useMemo(() => {
    if (!product) return false;
    return favorites.some((item) => item.id === product.id);
  }, [favorites, product]);

  function handleAddToCart() {
    if (!product) return;

    addToCart(product);
    setFeedback("Produto adicionado ao carrinho.");

    setTimeout(() => {
      setFeedback("");
    }, 1800);
  }

  function handleToggleFavorite() {
    if (!product) return;

    toggleFavorite(product);
    setFeedback(
      isFavorite
        ? "Produto removido dos favoritos."
        : "Produto adicionado aos favoritos."
    );

    setTimeout(() => {
      setFeedback("");
    }, 1800);
  }

  if (loading) {
    return (
      <section className="product-page">
        <div className="product-skeleton">
          <div className="product-skeleton-image skeleton" />
          <div className="product-skeleton-content">
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-box" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="product-page">
        <div className="product-state error">
          <h2>Não foi possível carregar o produto</h2>
          <p>{error}</p>
          <Link to="/" className="product-back-link">
            Voltar para a Home
          </Link>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-page">
        <div className="product-state">
          <h2>Produto não encontrado</h2>
          <p>O anúncio solicitado não existe ou foi removido.</p>
          <Link to="/" className="product-back-link">
            Voltar para a Home
          </Link>
        </div>
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

      <div className="product-layout">
        <div className="product-gallery">
          <div className="product-main-image-wrapper">
            <img
              src={getImageSrc(product.image_url)}
              alt={product.title}
              className="product-main-image"
            />
          </div>
        </div>

        <div className="product-info-card">
          <span className="product-category-badge">{product.category}</span>

          <h1>{product.title}</h1>

          <p className="product-seller">
            Vendido por{" "}
            <strong>{product.seller_name || "Vendedor da plataforma"}</strong>
          </p>

          <div className="product-price-box">
            <strong>R$ {Number(product.price).toFixed(2)}</strong>
            <span>em até 12x no cartão</span>
          </div>

          <div className="product-description-box">
            <h3>Descrição</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-actions">
            <button type="button" className="btn-buy" onClick={handleAddToCart}>
              Adicionar ao carrinho
            </button>

            <button
              type="button"
              className="btn-favorite"
              onClick={handleToggleFavorite}
            >
              {isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/carrinho")}
            >
              Ir para o carrinho
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}