import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
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

  const navigate = useNavigate();

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
            <div>
              <h3>{item.title}</h3>
              <p>
                {item.category} • {item.idioma} • {item.qualidade}
              </p>
            </div>

            <div className="cart-item__quantity">
              <button type="button" onClick={() => decreaseQuantity(item.id)}>
                -
              </button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => increaseQuantity(item.id)}>
                +
              </button>
            </div>

            <p>R$ {(item.quantity * Number(item.price)).toFixed(2)}</p>

            <button type="button" onClick={() => removeFromCart(item.id)}>
              Remover
            </button>
          </article>
        ))}
      </div>

      <aside className="cart-summary">
        <h3>Resumo</h3>
        <p>Total: R$ {totalPrice.toFixed(2)}</p>

        <button type="button" onClick={() => navigate("/checkout")}>
          Ir para checkout
        </button>

        <button type="button" onClick={clearCart}>
          Limpar carrinho
        </button>
      </aside>
    </section>
  );
}