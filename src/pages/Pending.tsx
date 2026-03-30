import { Link } from "react-router-dom";

export default function Pending() {
  return (
    <main className="container page-state">
      <h1>Pagamento pendente ⏳</h1>
      <p className="muted">Assim que houver confirmação, o pedido aparecerá em pedidos.</p>
      <Link className="primary-button" to="/pedidos">
        Ir para pedidos
      </Link>
    </main>
  );
}
