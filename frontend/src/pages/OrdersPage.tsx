import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, isApiError } from "../lib/api";
import type { Order, User } from "../lib/types";
import { useToast } from "../components/Toast";

export function OrdersPage({ user }: { user: User | null }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const list = await api.orders.list();
        if (!cancelled) setOrders(list);
      } catch (e) {
        toast.push({ kind: "error", title: "Unable to load orders", message: isApiError(e) ? e.message : "Network error" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  if (!user) {
    return (
      <div className="page">
        <div className="container">
          <div className="panel">
            <div className="title">Authorization required</div>
            <div className="muted" style={{ marginTop: 10 }}>
              <Link className="button" to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="panel">
          <div className="title">Orders</div>
          <div className="muted" style={{ marginTop: 8 }}>
            Data source: `GET /orders/`
          </div>
          <div className="hr" />
          {loading ? (
            <div className="muted">Loading...</div>
          ) : orders.length ? (
            <div className="grid" style={{ gap: 12 }}>
              {orders.map((order) => (
                <article key={order.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div className="title">Order #{order.id}</div>
                    <span className="badge">{order.status}</span>
                  </div>
                  <div className="muted2" style={{ marginTop: 8 }}>
                    Total: {formatPrice(order.total_price)} {order.created_at ? `• ${new Date(order.created_at).toLocaleString()}` : ""}
                  </div>
                  <div className="muted2" style={{ marginTop: 8 }}>
                    Items: {order.items?.map((item) => `${item.product_id} x ${item.quantity}`).join(", ") || "No items"}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="muted">No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatPrice(v: number | string) {
  const parsed = Number(v);
  const value = Number.isFinite(parsed) ? parsed : 0;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}
