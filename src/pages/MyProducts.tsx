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
  description: string;
  price: string;
  category: string;
  image: File | null;
};

const categories = ["Pokémon", "Treinador", "Energia", "Acessórios"];
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

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<EditFormState>({
    title: "",
    description: "",
    price: "",
    category: "Pokémon",
    image: null,
  });

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const data = await getMyProducts();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar seus anúncios."
      );
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
      description: product.description,
      price: String(product.price),
      category: product.category,
      image: null,
    });
  }

  function cancelEdit() {
    setEditingProductId(null);
    setForm({
      title: "",
      description: "",
      price: "",
      category: "Pokémon",
      image: null,
    });
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
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);

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
    <section>
      <h1>Meus anúncios</h1>
      <p>
        Gerencie seus produtos anunciados, atualize informações e exclua quando
        quiser.
      </p>

      {error && <div>{error}</div>}
      {success && <div>{success}</div>}

      {loading ? (
        <div>Carregando seus anúncios...</div>
      ) : products.length === 0 ? (
        <div>Você ainda não possui anúncios cadastrados.</div>
      ) : (
        <div className="home-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <img
                src={getImageSrc(product.image_url)}
                alt={product.title}
                className="product-card-image"
              />

              <div className="product-card-body">
                <span className="product-category">{product.category}</span>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <strong>R$ {Number(product.price).toFixed(2)}</strong>

                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => startEdit(product)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => handleDelete(product.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingProduct && (
        <div className="edit-modal-overlay" onClick={cancelEdit}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>Editar anúncio</h2>
              <button type="button" onClick={cancelEdit}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="edit-form">
              <label>
                Título
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </label>

              <label>
                Descrição
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  required
                />
              </label>

              <label>
                Preço
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  required
                />
              </label>

              <label>
                Categoria
                <select
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
              </label>

              <label>
                Nova imagem
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      image: e.target.files?.[0] ?? null,
                    }))
                  }
                />
              </label>

              <div className="edit-form-actions">
                <button type="button" className="btn-secondary" onClick={cancelEdit}>
                  Cancelar
                </button>

                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}