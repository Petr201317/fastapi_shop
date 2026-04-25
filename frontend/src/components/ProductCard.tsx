import React from "react";
import type { Product } from "../lib/types";

export function ProductCard({
  product,
  onOpen,
  onAdd
}: {
  product: Product;
  onOpen: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="card" style={{ gridColumn: "span 3" }}>
      <button
        onClick={onOpen}
        style={{ display: "block", width: "100%", padding: 0, border: 0, background: "transparent", cursor: "pointer" }}
        aria-label={`Открыть ${product.name}`}
      >
        <img className="cardImg" src={product.image_url} alt={product.name} loading="lazy" />
      </button>
      <div className="cardBody">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
          <div className="title" style={{ fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.name}
          </div>
          <div className="price">{formatPrice(product.price)}</div>
        </div>
        <div className="muted2" style={{ marginTop: 8, fontSize: 12, lineHeight: 1.45, height: 34, overflow: "hidden" }}>
          {product.description}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 12 }}>
          <span className="badge">ID {product.id}</span>
          <button className="btn btnPrimary" onClick={onAdd}>
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}

function formatPrice(v: number) {
  const value = Number.isFinite(v) ? v : 0;
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(value);
}

