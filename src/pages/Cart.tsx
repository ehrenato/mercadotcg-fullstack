import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";
import "../styles/cart.css";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalPrice,
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
      alert(error instanceof Error ? error.message : "Erro ao finalizar compra.");
    } finally {
      setLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <section className="cart-page-state">
        <h2>Seu carrinho está vazio</h2>
        <p>Adicione produtos para continuar.</p>
        <button className="primary-button" onClick={() => navigate("/")}>
          Ir para produtos
        </button>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-page__list">
        <div className="cart-page__header">
          <h2>Carrinho</h2>
          <p>{cartItems.length} item(ns) no carrinho</p>
        </div>

        <div className="cart-items">
          {cartItems.map((item) => (
            <article key={item.id} className="cart-item-card">
              <div className="cart-item-card__content">
                <h3>{item.title}</h3>
                <p className="cart-item-card__price">
                  R$ {Number(item.price).toFixed(2)}
                </p>
              </div>

              <div className="cart-item-card__actions">
                <div className="cart-qty-control">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>

                <strong className="cart-item-card__subtotal">
                  R$ {(item.quantity * Number(item.price)).toFixed(2)}
                </strong>

                <button
                  className="ghost-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remover
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="cart-summary-card">
        <h3>Resumo</h3>

        <div className="cart-summary-row">
          <span>Total</span>
          <strong>R$ {totalPrice.toFixed(2)}</strong>
        </div>

        <button
          className="primary-button cart-summary-button"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Finalizando..." : "Finalizar compra"}
        </button>

        <button className="secondary-button cart-summary-button" onClick={clearCart}>
          Limpar carrinho
        </button>
      </aside>
    </section>
  );
}