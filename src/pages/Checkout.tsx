import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (cart.length === 0) {
    return (
      <main className="container page-state">
        <h1>Carrinho vazio</h1>
        <p className="muted">Escolha alguns produtos antes de finalizar.</p>
      </main>
    );
  }

  async function handleCheckout() {
    setSubmitting(true);
    setError("");

    try {
      await createOrder(cart);
      clearCart();
      navigate("/pagamento/sucesso");
    } catch (caughtError) {
      if (axios.isAxiosError(caughtError)) {
        setError(caughtError.response?.data?.message ?? "Não foi possível finalizar a compra.");
      } else {
        setError("Não foi possível finalizar a compra.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container checkout-layout">
      <section className="card grid gap-md">
        <h1>Checkout</h1>
        {cart.map((item) => (
          <article key={item.id} className="row-between wrap gap-sm divider">
            <span>{item.title}</span>
            <strong>R$ {item.price.toFixed(2)}</strong>
          </article>
        ))}
      </section>

      <aside className="card grid gap-md">
        <h2>Total</h2>
        <strong className="price-xl">R$ {total.toFixed(2)}</strong>
        <button
          type="button"
          className="primary-button"
          onClick={handleCheckout}
          disabled={submitting}
        >
          {submitting ? "Processando..." : "Confirmar pagamento"}
        </button>
        {error ? <p className="error-text">{error}</p> : null}
      </aside>
    </main>
  );
}
