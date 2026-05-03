import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, isApiError } from "../lib/api";
import type { CartItemHydrated, User } from "../lib/types";
import { useToast } from "../components/Toast";

export function CartPage({ user, onCartChanged }: { user: User | null; onCartChanged: () => void }) {
  const [items, setItems] = useState<CartItemHydrated[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const raw = await api.cart.get();
        const hydrated: CartItemHydrated[] = raw.map((x) => ({ ...x, product: null }));
        setItems(hydrated);
        onCartChanged();

        // load product details in background
        await Promise.all(
          hydrated.map(async (x) => {
            try {
              const p = await api.products.byId(x.product_id);
              if (!cancelled) {
                setItems((prev) => prev.map((i) => (i.id === x.id ? { ...i, product: p } : i)));
              }
            } catch {
              // ignore per-item
            }
          })
        );
      } catch (e) {
        toast.push({ kind: "error", title: "Cart is unavailable", message: isApiError(e) ? e.message : "Sign in required" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast, onCartChanged]);

  const total = useMemo(() => {
    return items.reduce((sum, x) => sum + (Number(x.product?.price ?? 0) || 0) * x.quantity, 0);
  }, [items]);

  return (
    <div className="page">
      <div className="container">
        <div className="layoutSplit">
          <div className="panel">
            <div className="title" style={{ fontSize: 18 }}>Cart</div>
            <div className="muted" style={{ marginTop: 8 }}>
              {loading ? "Loading..." : `${items.length} positions`}
            </div>
            <div className="hr" />

            {loading ? (
              <div className="grid" style={{ gap: 12 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="card" style={{ height: 86, opacity: 0.7 }} />
                ))}
              </div>
            ) : items.length ? (
              <div className="grid" style={{ gap: 12 }}>
                {items.map((x) => (
                  <div key={x.id} className="card" style={{ display: "flex", gap: 12, padding: 12 }}>
                    <img
                      src={x.product?.image_url ?? "https://picsum.photos/seed/placeholder/200/200"}
                      alt={x.product?.name ?? `Product ${x.product_id}`}
                      style={{ width: 74, height: 74, borderRadius: 14, objectFit: "cover", border: "1px solid rgba(255,255,255,0.12)" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="title" style={{ fontSize: 14, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        {x.product?.name ?? `Product #${x.product_id}`}
                      </div>
                      <div className="muted2" style={{ marginTop: 6, fontSize: 12 }}>
                        Quantity: <b style={{ color: "var(--text-strong)" }}>{x.quantity}</b>
                      </div>
                      <div className="muted2" style={{ marginTop: 6, fontSize: 12 }}>
                        Price: <b style={{ color: "var(--text-strong)" }}>{formatPrice(x.product?.price ?? 0)}</b>
                      </div>
                    </div>
                    <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
                      <Link className="linkButton" to={`/product/${x.product_id}`}>
                        View
                      </Link>
                      <button
                        className="linkButton"
                        disabled={deletingId === x.id || !x.id}
                        onClick={async () => {
                          try {
                            if (!x.id) {
                              throw new Error("Missing cart item id");
                            }
                            setDeletingId(x.id);
                            await api.cart.remove(x.id);
                            setItems((prev) => prev.filter((i) => i.id !== x.id));
                            onCartChanged();
                            toast.push({ kind: "ok", title: "Item removed" });
                          } catch (e) {
                            toast.push({ kind: "error", title: "Delete failed", message: isApiError(e) ? e.message : "Network error" });
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                      >
                        {deletingId === x.id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="muted">
                Empty cart. <Link className="linkButton" to="/">Back to catalog</Link>
              </div>
            )}
          </div>

          <div className="panel">
            <div className="title">Checkout</div>
            <div className="muted" style={{ marginTop: 8 }}>
              Creates order with `POST /orders/create`.
            </div>
            <div className="hr" />
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <div className="muted">Total</div>
              <div className="price" style={{ fontSize: 24 }}>
                {formatPrice(total)}
              </div>
            </div>
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <button
                className="button"
                disabled={!user || !items.length || checkoutLoading}
                onClick={async () => {
                  try {
                    setCheckoutLoading(true);
                    await api.orders.create({
                      items: items.map((x) => ({ product_id: x.product_id, quantity: x.quantity }))
                    });
                    toast.push({ kind: "ok", title: "Order created" });
                  } catch (e) {
                    toast.push({ kind: "error", title: "Checkout failed", message: isApiError(e) ? e.message : "Network error" });
                  } finally {
                    setCheckoutLoading(false);
                  }
                }}
              >
                {checkoutLoading ? "Creating..." : "Create order"}
              </button>
              <Link className="linkButton" to="/orders">
                Open orders
              </Link>
            </div>
          </div>
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

