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
        category:
          selectedCategory !== "Todos" ? selectedCategory : undefined,
      });

      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar produtos."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, [selectedCategory]);

  function handleSearchSubmit(event: React.FormEvent) {
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
        <div className="home-hero-content">
          <span className="home-badge">Marketplace de cartas Pokémon</span>
          <h1>Encontre cartas raras, itens colecionáveis e acessórios.</h1>
          <p>
            Explore anúncios da comunidade, filtre por categoria e encontre as
            melhores oportunidades para sua coleção.
          </p>

          <form className="home-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome da carta..."
            />
            <button type="submit">Buscar</button>
          </form>
        </div>
      </div>

      <div className="home-toolbar">
        <div className="home-categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <p className="home-result-count">{totalProductsLabel}</p>
      </div>

      {error ? <div className="home-error">{error}</div> : null}

      {loading ? (
        <div className="products-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="product-card skeleton-card">
              <div className="skeleton skeleton-image" />
              <div className="skeleton skeleton-text short" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text small" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="home-empty">
          <p>Nenhum produto foi encontrado com os filtros atuais.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-card-image-wrap">
                <img
                  src={getImageSrc(product.image_url)}
                  alt={product.title}
                  className="product-card-image"
                />
              </div>

              <div className="product-card-content">
                <span className="product-card-category">{product.category}</span>

                <h3>{product.title}</h3>

                <p className="product-card-meta">
                  Idioma: {product.idioma} • Qualidade: {product.qualidade}
                </p>

                {product.extras ? (
                  <p className="product-card-extras">{product.extras}</p>
                ) : null}

                <div className="product-card-bottom">
                  <strong>R$ {Number(product.price).toFixed(2)}</strong>

                  {product.seller_name ? (
                    <span className="product-card-seller">
                      por {product.seller_name}
                    </span>
                  ) : null}
                </div>

                <Link to={`/produto/${product.id}`} className="product-card-link">
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