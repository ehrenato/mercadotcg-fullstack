import { Link } from "react-router-dom";

export default function Success() {
  return (
    <main className="container page-state">
      <h1>Pagamento aprovado ✅</h1>
      <p className="muted">Seu pedido foi confirmado com sucesso.</p>
      <Link className="primary-button" to="/pedidos">
        Ver meus pedidos
      </Link>
    </main>
  );
}
