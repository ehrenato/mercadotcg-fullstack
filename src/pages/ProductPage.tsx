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
    return <div className="product-page-status">Carregando produto...</div>;
  }

  if (error) {
    return (
      <section className="product-page-status">
        <h2>Não foi possível carregar o produto</h2>
        <p>{error}</p>
        <Link to="/">Voltar para a Home</Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-page-status">
        <h2>Produto não encontrado</h2>
        <p>O anúncio solicitado não existe ou foi removido.</p>
        <Link to="/">Voltar para a Home</Link>
      </section>
    );
  }

  return (
    <section className="product-page">
      <nav className="product-page__breadcrumb">
        <Link to="/">Home</Link> / {product.category} / {product.title}
      </nav>

      {feedback ? <div className="product-page__feedback">{feedback}</div> : null}

      <div className="product-page__content">
        <div className="product-page__gallery">
          <img
            src={getImageSrc(product.image_url)}
            alt={product.title}
            className="product-page__main-image"
          />
        </div>

        <div className="product-page__info">
          <span className="product-page__category">{product.category}</span>
          <h1>{product.title}</h1>

          <p className="product-page__seller">
            Vendido por {product.seller_name || "Vendedor da plataforma"}
          </p>

          <strong className="product-page__price">
            R$ {Number(product.price).toFixed(2)}
          </strong>

          <div className="product-page__actions">
            <button type="button" onClick={handleAddToCart}>
              Adicionar ao carrinho
            </button>

            <button type="button" onClick={handleToggleFavorite}>
              {isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            </button>

            <button type="button" onClick={() => navigate("/carrinho")}>
              Ir para o carrinho
            </button>
          </div>

          <ul className="product-page__details">
            <li>
              <strong>Idioma:</strong> {product.idioma}
            </li>
            <li>
              <strong>Qualidade:</strong> {product.qualidade}
            </li>
          </ul>

          {product.extras ? (
            <>
              <h3>Extras</h3>
              <p className="product-page__extras">{product.extras}</p>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}