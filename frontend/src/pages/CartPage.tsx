import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, isApiError } from "../lib/api";
import type { CartItemHydrated } from "../lib/types";
import { useToast } from "../components/Toast";

export function CartPage({ onCartChanged }: { onCartChanged: () => void }) {
  const [items, setItems] = useState<CartItemHydrated[]>([]);
  const [loading, setLoading] = useState(true);
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
                setItems((prev) => prev.map((i) => (i.product_id === x.product_id ? { ...i, product: p } : i)));
              }
            } catch {
              // ignore per-item
            }
          })
        );
      } catch (e) {
        toast.push({ kind: "error", title: "Корзина недоступна", message: isApiError(e) ? e.message : "Нужна авторизация" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast, onCartChanged]);

  const total = useMemo(() => {
    return items.reduce((sum, x) => sum + (x.product?.price ?? 0) * x.quantity, 0);
  }, [items]);

  return (
    <div className="page">
      <div className="container">
        <div className="twoCol">
          <div className="glass panelPad">
            <div className="title" style={{ fontSize: 18 }}>
              Корзина
            </div>
            <div className="muted" style={{ marginTop: 8 }}>
              {loading ? "Загрузка…" : `${items.length} позиций`}
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
                  <div key={x.product_id} className="card" style={{ display: "flex", gap: 12, padding: 12 }}>
                    <img
                      src={x.product?.image_url ?? "https://picsum.photos/seed/placeholder/200/200"}
                      alt={x.product?.name ?? `Product ${x.product_id}`}
                      style={{ width: 74, height: 74, borderRadius: 14, objectFit: "cover", border: "1px solid rgba(255,255,255,0.12)" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="title" style={{ fontSize: 14, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        {x.product?.name ?? `Товар #${x.product_id}`}
                      </div>
                      <div className="muted2" style={{ marginTop: 6, fontSize: 12 }}>
                        Кол-во: <b style={{ color: "rgba(255,255,255,0.85)" }}>{x.quantity}</b>
                      </div>
                      <div className="muted2" style={{ marginTop: 6, fontSize: 12 }}>
                        Цена: <b style={{ color: "rgba(255,255,255,0.85)" }}>{formatPrice(x.product?.price ?? 0)}</b>
                      </div>
                    </div>
                    <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
                      <Link className="btn" to={`/product/${x.product_id}`}>
                        Открыть
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="muted">
                Пусто. <Link className="btn" to="/">Вернуться к товарам</Link>
              </div>
            )}
          </div>

          <div className="glass panelPad">
            <div className="title">Итого</div>
            <div className="muted" style={{ marginTop: 8 }}>
              Сумма по товарам (по данным /products).
            </div>
            <div className="hr" />
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <div className="muted">К оплате</div>
              <div className="price" style={{ fontSize: 24 }}>
                {formatPrice(total)}
              </div>
            </div>
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <button className="btn btnPrimary" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
                Оформить заказ (скоро)
              </button>
              <Link className="btn" to="/">
                Продолжить покупки
              </Link>
              <div className="muted2" style={{ fontSize: 12, lineHeight: 1.45 }}>
                В бэке пока нет эндпоинта для оформления заказа в `src/api.py`, поэтому тут заглушка.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPrice(v: number) {
  const value = Number.isFinite(v) ? v : 0;
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(value);
}

