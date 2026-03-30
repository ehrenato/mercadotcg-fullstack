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
    return <main className="container page-state">Carregando pedidos...</main>;
  }

  return (
    <main className="container grid gap-md">
      <div>
        <h1>Meus pedidos</h1>
        <p className="muted">Pedidos reais vindos do backend.</p>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      {orders.length === 0 ? (
        <article className="card grid gap-sm">
          <h2>Nenhum pedido encontrado</h2>
          <p className="muted">Finalize uma compra para ver seus pedidos aqui.</p>
        </article>
      ) : (
        orders.map((order) => (
          <article key={order.id} className="card grid gap-sm">
            <div className="row-between wrap gap-sm">
              <h2>Pedido #{order.id}</h2>
              <span className="badge">{order.status}</span>
            </div>
            <strong>Total: R$ {order.total.toFixed(2)}</strong>
            <ul>
              {order.items.map((item) => (
                <li key={`${order.id}-${item}`}>{item}</li>
              ))}
            </ul>
          </article>
        ))
      )}
    </main>
  );
}
