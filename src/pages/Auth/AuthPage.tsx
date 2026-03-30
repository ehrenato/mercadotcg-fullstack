import type { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../styles/AuthPage.css";

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
  }

  return (
    <section className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-left">
          <div className="auth-brand">
            <span className="auth-badge">MercadoTCG</span>
            <h1>
              Compre, venda e gerencie suas cartas com uma experiência moderna.
            </h1>
            <p>
              Entre na sua conta para anunciar produtos, acompanhar pedidos e
              administrar seus anúncios em um só lugar.
            </p>

            <ul className="auth-features">
              <li>✔ Cadastro e login com autenticação real</li>
              <li>✔ Área para gerenciar seus anúncios</li>
              <li>✔ Upload de produtos com imagem</li>
              <li>✔ Fluxo preparado para pedidos e carrinho</li>
            </ul>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>{isLoginMode ? "Entrar" : "Criar conta"}</h2>
              <p>
                {isLoginMode
                  ? "Acesse sua conta para continuar."
                  : "Cadastre-se para começar a anunciar."}
              </p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLoginMode && (
                <label>
                  Nome
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    required={!isLoginMode}
                  />
                </label>
              )}

              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  required
                />
              </label>

              <label>
                Senha
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                />
              </label>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? isLoginMode
                    ? "Entrando..."
                    : "Criando conta..."
                  : isLoginMode
                  ? "Entrar"
                  : "Criar conta"}
              </button>
            </form>

            <div className="auth-switch">
              <span>
                {isLoginMode ? "Ainda não tem conta?" : "Já possui conta?"}
              </span>
              <button type="button" onClick={toggleMode}>
                {isLoginMode ? "Criar conta" : "Entrar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}