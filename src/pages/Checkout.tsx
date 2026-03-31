import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";
import "../styles/checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleCheckout() {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createOrder({
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      setSuccess("Pedido realizado com sucesso!");
      clearCart();

      setTimeout(() => {
        navigate("/pedidos");
      }, 1000);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível finalizar a compra."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <section className="checkout-page">
        <div className="checkout-empty">
          <h1>Carrinho vazio</h1>
          <p>Escolha alguns produtos antes de finalizar a compra.</p>
          <Link to="/" className="checkout-back-link">
            Voltar para a home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Revise seus itens antes de confirmar o pedido.</p>
      </div>

      {error ? <div className="checkout-alert error">{error}</div> : null}
      {success ? <div className="checkout-alert success">{success}</div> : null}

      <div className="checkout-layout">
        <div className="checkout-items">
          {cartItems.map((item) => (
            <article key={item.id} className="checkout-item">
              <div className="checkout-item__info">
                <h3>{item.title}</h3>
                <p>
                  <strong>Categoria:</strong> {item.category}
                </p>
                <p>
                  <strong>Idioma:</strong> {item.idioma}
                </p>
                <p>
                  <strong>Qualidade:</strong> {item.qualidade}
                </p>
              </div>

              <div className="checkout-item__summary">
                <span>Qtd: {item.quantity}</span>
                <strong>
                  R$ {(Number(item.price) * item.quantity).toFixed(2)}
                </strong>
              </div>
            </article>
          ))}
        </div>

        <aside className="checkout-summary">
          <h2>Resumo</h2>

          <div className="checkout-summary__row">
            <span>Itens</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="checkout-summary__row">
            <span>Total</span>
            <strong>R$ {totalPrice.toFixed(2)}</strong>
          </div>

          <button
            type="button"
            className="checkout-confirm-button"
            onClick={handleCheckout}
            disabled={submitting}
          >
            {submitting ? "Processando..." : "Confirmar pagamento"}
          </button>
        </aside>
      </div>
    </section>
  );
}