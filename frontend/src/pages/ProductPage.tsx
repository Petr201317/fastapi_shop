import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, isApiError } from "../lib/api";
import type { Product } from "../lib/types";
import { useToast } from "../components/Toast";

export function ProductPage({ onCartChanged }: { onCartChanged: () => void }) {
  const { id } = useParams();
  const productId = Number(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const p = await api.products.byId(productId);
        if (!cancelled) setProduct(p);
      } catch (e) {
        toast.push({ kind: "error", title: "Товар не найден", message: isApiError(e) ? e.message : "Ошибка сети" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId, toast]);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="glass panelPad" style={{ height: 460 }} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <div className="container">
          <div className="glass panelPad">
            <div className="title">Не удалось загрузить товар</div>
            <div className="muted" style={{ marginTop: 8 }}>
              <Link className="btn" to="/">
                На главную
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="twoCol">
          <div className="card">
            <img className="cardImg" style={{ height: 420 }} src={product.image_url} alt={product.name} />
          </div>
          <div className="glass panelPad">
            <div className="badge">Товар #{product.id}</div>
            <div className="title" style={{ fontSize: 22, marginTop: 10 }}>
              {product.name}
            </div>
            <div className="muted" style={{ marginTop: 10, lineHeight: 1.55 }}>
              {product.description}
            </div>
            <div className="hr" />
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <div className="muted">Цена</div>
              <div className="price" style={{ fontSize: 26 }}>
                {formatPrice(product.price)}
              </div>
            </div>
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <button
                className="btn btnPrimary"
                onClick={async () => {
                  try {
                    await api.cart.add(product.id, 1);
                    toast.push({ kind: "ok", title: "Добавлено в корзину", message: product.name });
                    onCartChanged();
                  } catch (e) {
                    toast.push({ kind: "error", title: "Не получилось добавить", message: isApiError(e) ? e.message : "Ошибка сети" });
                  }
                }}
              >
                В корзину
              </button>
              <Link className="btn" to="/cart">
                Перейти в корзину
              </Link>
              <Link className="btn" to="/">
                ← Продолжить покупки
              </Link>
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

