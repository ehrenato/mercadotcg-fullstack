import { useMemo, useState } from "react";
import Banner from "../components/Banner";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import { useSearch } from "../context/SearchContext";
import { useProducts } from "../hooks/useProducts";

export default function Home() {
  const { search } = useSearch();
  const { products, loading } = useProducts(search);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products],
  );

  const visibleProducts = useMemo(
    () =>
      selectedCategory
        ? products.filter((product) => product.category === selectedCategory)
        : products,
    [products, selectedCategory],
  );

  return (
    <main className="container grid gap-lg">
      <Banner />

      <section className="grid gap-md">
        <div className="row-between wrap gap-md">
          <div>
            <h2>Cartas em destaque</h2>
            <p className="muted">
              Busca global, favoritos, carrinho e rotas protegidas funcionando.
            </p>
          </div>
          <Categories
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {loading ? (
          <div className="page-state">Carregando produtos...</div>
        ) : (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
