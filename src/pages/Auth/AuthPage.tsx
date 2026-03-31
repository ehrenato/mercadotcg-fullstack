import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/AuthPage.css";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar.");
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setIsLoginMode((prev) => !prev);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <section className="auth-page">
      <div className="auth-page__hero">
        <span className="auth-page__badge">MercadoTCG</span>
        <h1>Compre, venda e gerencie suas cartas.</h1>
        <p>
          Entre na sua conta para anunciar produtos, acompanhar pedidos e
          administrar seus anúncios em um só lugar.
        </p>

        <ul className="auth-page__features">
          <li>Cadastro e login com autenticação real</li>
          <li>Área para gerenciar seus anúncios</li>
          <li>Upload de produtos com imagem</li>
          <li>Fluxo preparado para pedidos e carrinho</li>
        </ul>
      </div>

      <div className="auth-card-modern">
        <div className="auth-card-modern__header">
          <h2>{isLoginMode ? "Entrar" : "Criar conta"}</h2>
          <p>
            {isLoginMode
              ? "Acesse sua conta para continuar."
              : "Cadastre-se para começar a anunciar."}
          </p>
        </div>

        {error && <div className="auth-card-modern__error">{error}</div>}

        <form className="auth-card-modern__form" onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="auth-field">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required={!isLoginMode}
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" className="auth-submit-button" disabled={loading}>
            {loading
              ? isLoginMode
                ? "Entrando..."
                : "Criando conta..."
              : isLoginMode
                ? "Entrar"
                : "Criar conta"}
          </button>
        </form>

        <div className="auth-card-modern__footer">
          <span>
            {isLoginMode ? "Ainda não tem conta?" : "Já possui conta?"}
          </span>

          <button
            type="button"
            className="auth-toggle-button"
            onClick={toggleMode}
          >
            {isLoginMode ? "Criar conta" : "Entrar"}
          </button>
        </div>
      </div>
    </section>
  );
}