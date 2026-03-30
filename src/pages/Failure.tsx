import { Link } from "react-router-dom";

export default function Failure() {
  return (
    <main className="container page-state">
      <h1>Pagamento recusado ❌</h1>
      <p className="muted">Tente novamente ou escolha outra forma de pagamento.</p>
      <Link className="primary-button" to="/checkout">
        Voltar ao checkout
      </Link>
    </main>
  );
}
