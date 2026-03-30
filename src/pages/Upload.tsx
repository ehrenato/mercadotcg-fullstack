import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/api";
import "../styles/Upload.css";

const categories = ["Pokémon", "Treinador", "Energia", "Acessórios"];
const conditions = ["Excelente", "Muito boa", "Boa", "Regular"];

export default function Upload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Pokémon");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("Excelente");
  const [image, setImage] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("category", category);
      formData.append(
        "description",
        `${description}\n\nCondição do item: ${condition}`
      );

      if (image) {
        formData.append("image", image);
      }

      await createProduct(formData);

      setSuccess("Anúncio publicado com sucesso!");

      setTitle("");
      setPrice("");
      setCategory("Pokémon");
      setDescription("");
      setCondition("Excelente");
      setImage(null);

      setTimeout(() => {
        navigate("/meus-anuncios");
      }, 900);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao publicar anúncio."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="upload-page">
      <div className="upload-card">
        <div className="upload-header">
          <h1>Criar anúncio</h1>
          <p>
            Preencha os dados do produto e publique seu anúncio no marketplace.
          </p>
        </div>

        {success && <div className="upload-alert success">{success}</div>}
        {error && <div className="upload-alert error">{error}</div>}

        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="upload-grid">
            <label>
              Título
              <input
                type="text"
                placeholder="Ex.: Charizard Holográfico 1999"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <label>
              Preço
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>

            <label>
              Categoria
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Condição
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                {conditions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Descrição
            <textarea
              rows={6}
              placeholder="Descreva detalhes importantes do item, edição, estado de conservação, observações, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <label>
            Imagem do produto
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />
          </label>

          <div className="upload-actions">
            <button
              type="button"
              className="upload-secondary"
              onClick={() => navigate("/")}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="upload-primary"
              disabled={submitting}
            >
              {submitting ? "Publicando..." : "Publicar anúncio"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}