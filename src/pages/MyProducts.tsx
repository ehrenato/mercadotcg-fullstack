import { useEffect, useMemo, useState } from "react";
import {
  deleteProduct,
  getMyProducts,
  updateProduct,
  type Product,
} from "../services/api";
import "../styles/MyProducts.css";

type EditFormState = {
  title: string;
  price: string;
  category: string;
  idioma: string;
  qualidade: string;
  extras: string;
  image: File | null;
};

const categories = ["Pokémon", "Treinador", "Energia", "Acessórios"];
const idiomas = ["Português", "Inglês", "Japonês", "Espanhol", "Outro"];
const qualidades = ["Nova", "Excelente", "Muito boa", "Boa", "Regular"];

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

const initialForm: EditFormState = {
  title: "",
  price: "",
  category: "Pokémon",
  idioma: "Português",
  qualidade: "Excelente",
  extras: "",
  image: null,
};

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<EditFormState>(initialForm);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar seus anúncios.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const editingProduct = useMemo(
    () => products.find((product) => product.id === editingProductId) ?? null,
    [products, editingProductId]
  );

  function startEdit(product: Product) {
    setSuccess("");
    setError("");
    setEditingProductId(product.id);
    setForm({
      title: product.title,
      price: String(product.price),
      category: product.category,
      idioma: product.idioma,
      qualidade: product.qualidade,
      extras: product.extras ?? "",
      image: null,
    });
  }

  function cancelEdit() {
    setEditingProductId(null);
    setForm(initialForm);
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Tem certeza que deseja excluir este anúncio?");
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteProduct(id);

      setProducts((prev) => prev.filter((product) => product.id !== id));

      if (editingProductId === id) {
        cancelEdit();
      }

      setSuccess("Anúncio excluído com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir anúncio.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingProductId) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("idioma", form.idioma);
      formData.append("qualidade", form.qualidade);
      formData.append("extras", form.extras);

      if (form.image) {
        formData.append("image", form.image);
      }

      const updated = await updateProduct(editingProductId, formData);

      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProductId ? updated : product
        )
      );

      setSuccess("Anúncio atualizado com sucesso.");
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar anúncio.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="my-products-page">
      <div className="my-products-header">
        <h1>Meus anúncios</h1>
        <p>Gerencie suas cartas anunciadas, atualize informações e exclua quando quiser.</p>
      </div>

      {error ? <div className="my-products-alert error">{error}</div> : null}
      {success ? <div className="my-products-alert success">{success}</div> : null}

      {loading ? (
        <div className="my-products-empty">Carregando seus anúncios...</div>
      ) : products.length === 0 ? (
        <div className="my-products-empty">Você ainda não possui anúncios cadastrados.</div>
      ) : (
        <div className="my-products-grid">
          {products.map((product) => (
            <article key={product.id} className="my-product-card">
              <img
                src={getImageSrc(product.image_url)}
                alt={product.title}
                className="my-product-card__image"
              />

              <div className="my-product-card__content">
                <span className="my-product-card__badge">{product.category}</span>
                <h3>{product.title}</h3>

                <ul className="my-product-card__meta">
                  <li>
                    <strong>Idioma:</strong> {product.idioma}
                  </li>
                  <li>
                    <strong>Qualidade:</strong> {product.qualidade}
                  </li>
                </ul>

                {product.extras ? (
                  <p className="my-product-card__extras">{product.extras}</p>
                ) : null}

                <strong className="my-product-card__price">
                  R$ {Number(product.price).toFixed(2)}
                </strong>

                <div className="my-product-card__actions">
                  <button type="button" onClick={() => startEdit(product)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingProduct ? (
        <div className="my-products-modal" onClick={cancelEdit}>
          <div
            className="my-products-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="my-products-modal__header">
              <h2>Editar anúncio</h2>
              <button type="button" onClick={cancelEdit}>
                ×
              </button>
            </div>

            <form className="my-products-form" onSubmit={handleSubmit}>
              <div className="my-products-form__field">
                <label htmlFor="title">Título</label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="my-products-form__field">
                <label htmlFor="price">Preço</label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="my-products-form__field">
                <label htmlFor="category">Categoria</label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="my-products-form__field">
                <label htmlFor="idioma">Idioma</label>
                <select
                  id="idioma"
                  value={form.idioma}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, idioma: e.target.value }))
                  }
                >
                  {idiomas.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="my-products-form__field">
                <label htmlFor="qualidade">Qualidade</label>
                <select
                  id="qualidade"
                  value={form.qualidade}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, qualidade: e.target.value }))
                  }
                >
                  {qualidades.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="my-products-form__field">
                <label htmlFor="extras">Extras</label>
                <textarea
                  id="extras"
                  rows={4}
                  value={form.extras}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, extras: e.target.value }))
                  }
                />
              </div>

              <div className="my-products-form__field">
                <label htmlFor="image">Nova imagem</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      image: e.target.files?.[0] ?? null,
                    }))
                  }
                />
              </div>

              <div className="my-products-form__actions">
                <button type="button" className="secondary-button" onClick={cancelEdit}>
                  Cancelar
                </button>
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}