import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, type Product } from "../services/api";
import "../styles/home.css";

const categories = ["Todos", "Pokémon", "Treinador", "Energia", "Acessórios"];
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts({
        search: search.trim() || undefined,
        category: selectedCategory !== "Todos" ? selectedCategory : undefined,
      });

      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, [selectedCategory]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadProducts();
  }

  const totalProductsLabel = useMemo(() => {
    if (loading) return "Carregando produtos...";
    if (products.length === 0) return "Nenhum produto encontrado";
    if (products.length === 1) return "1 produto encontrado";
    return `${products.length} produtos encontrados`;
  }, [loading, products.length]);

  return (
    <section className="home-page">
      <div className="home-hero">
        <span className="home-badge">Marketplace de cartas Pokémon</span>
        <h1>Encontre cartas raras, itens colecionáveis e acessórios.</h1>
        <p>
          Explore anúncios da comunidade, filtre por categoria e encontre as
          melhores oportunidades para sua coleção.
        </p>
      </div>

      <div className="home-toolbar">
        <form className="home-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>

        <div className="home-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-chip ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="home-results-header">{totalProductsLabel}</div>
      </div>

      {error && <div className="home-alert error">{error}</div>}

      {loading ? (
        <div className="home-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <article key={index} className="product-card skeleton-card">
              <div className="skeleton skeleton-image" />
              <div className="product-card-body">
                <div className="skeleton skeleton-line short" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line short" />
              </div>
            </article>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="home-empty">
          Nenhum produto foi encontrado com os filtros atuais.
        </div>
      ) : (
        <div className="home-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <Link
                to={`/produto/${product.id}`}
                className="product-card-image-link"
              >
                <img
                  src={getImageSrc(product.image_url)}
                  alt={product.title}
                  className="product-card-image"
                />
              </Link>

              <div className="product-card-body">
                <span className="product-category">{product.category}</span>

                <Link
                  to={`/produto/${product.id}`}
                  className="product-title-link"
                >
                  <h3>{product.title}</h3>
                </Link>

                <p className="product-description">{product.description}</p>

                <div className="product-meta">
                  <strong>R$ {Number(product.price).toFixed(2)}</strong>
                  {product.seller_name && (
                    <span className="product-seller">
                      por {product.seller_name}
                    </span>
                  )}
                </div>

                <Link to={`/produto/${product.id}`} className="product-action">
                  Ver detalhes
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}