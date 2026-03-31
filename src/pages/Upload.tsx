import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/api";
import "../styles/Upload.css";

const categories = ["Pokémon", "Treinador", "Energia", "Acessórios"];
const idiomas = ["Português", "Inglês", "Japonês", "Espanhol", "Outro"];
const qualidades = ["Nova", "Excelente", "Muito boa", "Boa", "Regular"];

export default function Upload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Pokémon");
  const [idioma, setIdioma] = useState("Português");
  const [qualidade, setQualidade] = useState("Excelente");
  const [extras, setExtras] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("price", price);
      formData.append("category", category);
      formData.append("idioma", idioma);
      formData.append("qualidade", qualidade);
      formData.append("extras", extras.trim());

      if (image) {
        formData.append("image", image);
      }

      await createProduct(formData);

      setSuccess("Anúncio publicado com sucesso!");
      setTitle("");
      setPrice("");
      setCategory("Pokémon");
      setIdioma("Português");
      setQualidade("Excelente");
      setExtras("");
      setImage(null);

      setTimeout(() => {
        navigate("/meus-anuncios");
      }, 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao publicar anúncio.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="upload-page">
      <div className="upload-card">
        <h1>Criar anúncio</h1>
        <p>Preencha os dados da carta e publique seu anúncio no marketplace.</p>

        {success ? <div className="upload-success">{success}</div> : null}
        {error ? <div className="upload-error">{error}</div> : null}

        <form className="upload-form" onSubmit={handleSubmit}>
          <label>
            Título
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Charizard Base Set"
              required
            />
          </label>

          <label>
            Preço
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0,00"
              required
            />
          </label>

          <label>
            Categoria
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Idioma
            <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
              {idiomas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Qualidade
            <select value={qualidade} onChange={(e) => setQualidade(e.target.value)}>
              {qualidades.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Extras
            <textarea
              value={extras}
              onChange={(e) => setExtras(e.target.value)}
              placeholder="Ex.: holográfica, edição especial, com sleeve, pequeno desgaste na borda..."
              rows={5}
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

            <button type="submit" className="upload-primary" disabled={submitting}>
              {submitting ? "Publicando..." : "Publicar anúncio"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}