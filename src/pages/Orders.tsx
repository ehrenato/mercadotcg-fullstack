import { useEffect, useState } from "react";
import { getOrders, type Order } from "../services/api";
import "../styles/Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const data = await getOrders();

        if (active) {
          setOrders(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar seus pedidos."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="orders-state">
        <p>Carregando pedidos...</p>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <div className="orders-page__header">
        <h1>Meus pedidos</h1>
        <p>Confira aqui seus pedidos.</p>
      </div>

      {error ? <div className="orders-alert">{error}</div> : null}

      {orders.length === 0 ? (
        <div className="orders-empty">
          <h2>Nenhum pedido encontrado</h2>
          <p>Finalize uma compra para ver seus pedidos aqui.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="order-card__header">
                <div>
                  <span className="order-card__label">Pedido</span>
                  <h2>#{order.id}</h2>
                </div>

                <div className="order-card__meta">
                  <strong>R$ {Number(order.total).toFixed(2)}</strong>
                  <span>
                    {new Date(order.created_at).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <div>
                      <strong>{item.title}</strong>
                      <p>
                        Quantidade: {item.quantity} · Unitário: R${" "}
                        {Number(item.unit_price).toFixed(2)}
                      </p>
                    </div>

                    <span className="order-item__total">
                      R$ {(Number(item.unit_price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}