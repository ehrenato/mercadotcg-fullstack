import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/api";
import "../styles/Upload.css";

const categories = ["Pokémon", "Magic"];
const idiomas = ["Português", "Inglês", "Japonês"];
const qualidades = ["(M)Nova", "(NM) Praticamente nova ou superior", "(SP)Usada levemente ou superior", "(MP)Usada moderadamento ou superior", "(HP)Muito usada ou superior", "(D)Danificada ou superior"];

export default function Upload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [idioma, setIdioma] = useState("");
  const [qualidade, setQualidade] = useState("");
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
      formData.append("idioma", `${idioma}\n\nIdioma do item: ${idioma}`);
      formData.append("qualidade", `${qualidade}\n\nQualidade do item: ${qualidade}`);

      if (image) {
        formData.append("image", image);
      }

      await createProduct(formData);

      setSuccess("Anúncio publicado com sucesso!");
      setTitle("");
      setPrice("");
      setCategory("");
      setIdioma("");
      setQualidade("");
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
        <p>Preencha os dados do produto e publique seu anúncio no marketplace.</p>
        <p>*Ao digitar o nome da carta, também coloque o número para facilitar a busca.</p> 

        {success && <div className="upload-success">{success}</div>}
        {error && <div className="upload-error">{error}</div>}

        <form onSubmit={handleSubmit} className="upload-form">
          <label>
            Título
            <input placeholder="Ex: Toxtricity-V (70/192)" value={title} onChange={(e) => setTitle(e.target.value)} required />
            
          </label>


          <label>
            Preço
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
            <textarea
              value={qualidade}
              onChange={(e) => setQualidade(e.target.value)}
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

            <button type="submit" className="upload-primary" disabled={submitting}>
              {submitting ? "Publicando..." : "Publicar anúncio"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}