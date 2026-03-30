import { useState } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

export default function Cart() {
  const {
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
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
      <div className="cart-empty">
        <h2>Seu carrinho está vazio</h2>
        <p>Adicione produtos para continuar</p>
        <button onClick={() => navigate("/")}>Ir para produtos</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-list">
        <h2>Carrinho</h2>

        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={item.image_url || "/placeholder.png"}
              alt={item.title}
            />

            <div className="cart-info">
              <h3>{item.title}</h3>
              <p>R$ {Number(item.price).toFixed(2)}</p>

              <div className="cart-actions">
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => addToCart(item)}>+</button>
              </div>
            </div>

            <div className="cart-right">
              <strong>
                R$ {(item.quantity * Number(item.price)).toFixed(2)}
              </strong>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Resumo</h3>

        <div className="summary-row">
          <span>Total:</span>
          <strong>R$ {cartTotal.toFixed(2)}</strong>
        </div>

        <button
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Finalizando..." : "Finalizar compra"}
        </button>

        <button className="clear-btn" onClick={clearCart}>
          Limpar carrinho
        </button>
      </div>
    </div>
  );
}