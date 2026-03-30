import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";
import "../styles/Cart.css";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleCheckout() {
    try {
      setLoading(true);

      const items = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      await createOrder({ items });
      clearCart();
      alert("Pedido realizado com sucesso!");
      navigate("/pedidos");
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <section className="cart-page">
        <h2>Seu carrinho está vazio</h2>
        <p>Adicione produtos para continuar.</p>
        <button type="button" onClick={() => navigate("/")}>
          Ir para produtos
        </button>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h2>Carrinho</h2>

      <div className="cart-list">
        {cartItems.map((item) => (
          <article key={item.id} className="cart-item">
            <h3>{item.title}</h3>
            <p>R$ {Number(item.price).toFixed(2)}</p>

            <div className="cart-qty">
              <button type="button" onClick={() => decreaseQuantity(item.id)}>
                -
              </button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => increaseQuantity(item.id)}>
                +
              </button>
            </div>

            <strong>
              R$ {(item.quantity * Number(item.price)).toFixed(2)}
            </strong>

            <button type="button" onClick={() => removeFromCart(item.id)}>
              Remover
            </button>
          </article>
        ))}
      </div>

      <aside className="cart-summary">
        <h3>Resumo</h3>
        <p>Total: R$ {totalPrice.toFixed(2)}</p>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" onClick={handleCheckout} disabled={loading}>
            {loading ? "Finalizando..." : "Finalizar compra"}
          </button>

          <button type="button" onClick={clearCart}>
            Limpar carrinho
          </button>
        </div>
      </aside>
    </section>
  );
}