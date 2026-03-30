import axios from "axios";
import { useState } from "react";
import { createProduct } from "../services/api";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("Excelente");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("condition", condition);
      if (image) {
        formData.append("image", image);
      }

      const created = await createProduct(formData);
      setStatus(`Produto "${created.title}" enviado com sucesso.`);
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setCondition("Excelente");
      setImage(null);
    } catch (caughtError) {
      if (axios.isAxiosError(caughtError)) {
        setError(caughtError.response?.data?.message ?? "Não foi possível publicar o anúncio.");
      } else {
        setError("Não foi possível publicar o anúncio.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div>
          <span className="badge">Área do vendedor</span>
          <h1>Criar anúncio</h1>
          <p className="muted">Insira abaixo as informações do seu anúncio.</p>
        </div>

        <form className="grid gap-md" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título do produto"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Preço"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Categoria"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          />
          <textarea
            placeholder="Descrição do produto"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            required
          />
          <select value={condition} onChange={(event) => setCondition(event.target.value)}>
            <option value="Excelente">Excelente</option>
            <option value="Near Mint">Near Mint</option>
            <option value="Muito boa">Muito boa</option>
            <option value="Boa">Boa</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          />
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "Publicando..." : "Publicar anúncio"}
          </button>
        </form>

        {status ? <p className="success-text">{status}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
      </section>
    </main>
  );
}
