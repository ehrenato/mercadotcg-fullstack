import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (cartItems.length === 0) {
    return (
      <section>
        <h1>Carrinho vazio</h1>
        <p>Escolha alguns produtos antes de finalizar.</p>
      </section>
    );
  }

  async function handleCheckout() {
    setSubmitting(true);
    setError("");

    try {
      await createOrder({
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      navigate("/pedidos");
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

  return (
    <section>
      <h1>Checkout</h1>

      <div>
        {cartItems.map((item) => (
          <div key={item.id}>
            {item.title} — R$ {Number(item.price).toFixed(2)} x {item.quantity}
          </div>
        ))}
      </div>

      <h2>Total</h2>
      <p>R$ {totalPrice.toFixed(2)}</p>

      <button type="button" onClick={handleCheckout} disabled={submitting}>
        {submitting ? "Processando..." : "Confirmar pagamento"}
      </button>

      {error ? <p>{error}</p> : null}
    </section>
  );
}