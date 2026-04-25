import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, isApiError } from "../lib/api";
import type { Product } from "../lib/types";
import { ProductCard } from "../components/ProductCard";
import { useToast } from "../components/Toast";

const pills = ["Все", "Новинки", "Для дома", "Электроника", "Красота", "Спорт"];

export function HomePage({
  query,
  onCartChanged
}: {
  query: string;
  onCartChanged: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePill, setActivePill] = useState(pills[0]);
  const toast = useToast();
  const nav = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const list = await api.products.list(48, 0);
        if (!cancelled) setProducts(list);
      } catch (e) {
        toast.push({ kind: "error", title: "Не удалось загрузить товары", message: isApiError(e) ? e.message : "Ошибка сети" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <div className="page">
      <div className="container">
        <div className="glass hero">
          <div>
            <h1>Покупай как на настоящем маркетплейсе</h1>
            <p>
              Этот фронтенд использует твой бэкенд: товары, корзина, login и refresh access через cookies.
              Приятный UI, быстрый поиск, карточки и реальные маршруты API.
            </p>
            <div className="hr" />
            <div className="kpiRow">
              <div className="kpi">
                <b>Супер‑быстрый</b>
                <span>Vite + React + proxy на FastAPI</span>
              </div>
              <div className="kpi">
                <b>Cookies‑auth</b>
                <span>credentials: include + refresh retry</span>
              </div>
              <div className="kpi">
                <b>Реальные API</b>
                <span>/auth /products /cart</span>
              </div>
            </div>
          </div>
          <div className="heroArt" />
        </div>

        <div className="pillRow" style={{ marginTop: 14 }}>
          {pills.map((p) => (
            <button
              key={p}
              className={`pill ${p === activePill ? "pillActive" : ""}`}
              onClick={() => setActivePill(p)}
            >
              {p}
            </button>
          ))}
          <span className="badge" style={{ marginLeft: "auto" }}>
            {loading ? "Загрузка…" : `${filtered.length} товаров`}
          </span>
        </div>

        <div style={{ marginTop: 14 }} className="grid gridProducts">
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card" style={{ gridColumn: "span 3", height: 320, opacity: 0.7 }} />
            ))
          ) : filtered.length ? (
            filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpen={() => nav(`/product/${p.id}`)}
                onAdd={async () => {
                  try {
                    await api.cart.add(p.id, 1);
                    toast.push({ kind: "ok", title: "Добавлено в корзину", message: p.name });
                    onCartChanged();
                  } catch (e) {
                    toast.push({ kind: "error", title: "Не получилось добавить", message: isApiError(e) ? e.message : "Ошибка сети" });
                  }
                }}
              />
            ))
          ) : (
            <div className="glass panelPad" style={{ gridColumn: "1 / -1" }}>
              <div className="title">Ничего не найдено</div>
              <div className="muted" style={{ marginTop: 8 }}>
                Попробуй изменить запрос поиска.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

