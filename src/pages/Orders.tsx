import { useEffect, useState } from "react";
import { getOrders, type Order } from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const data = await getOrders();

        if (active) {
          setOrders(data);
        }
      } catch {
        if (active) {
          setError("Não foi possível carregar seus pedidos.");
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
    return <div>Carregando pedidos...</div>;
  }

  return (
    <section>
      <h1>Meus pedidos</h1>
      <p>Pedidos reais vindos do backend.</p>

      {error ? <div>{error}</div> : null}

      {orders.length === 0 ? (
        <div>
          <h2>Nenhum pedido encontrado</h2>
          <p>Finalize uma compra para ver seus pedidos aqui.</p>
        </div>
      ) : (
        orders.map((order) => (
          <article key={order.id}>
            <h2>Pedido #{order.id}</h2>
            <p>Total: R$ {Number(order.total).toFixed(2)}</p>
            <p>
              Data:{" "}
              {new Date(order.created_at).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>

            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.title} — {item.quantity}x — R$ {Number(item.unit_price).toFixed(2)}
                </li>
              ))}
            </ul>
          </article>
        ))
      )}
    </section>
  );
}