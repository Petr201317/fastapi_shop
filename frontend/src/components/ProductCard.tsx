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
    <div className="card">
      <button
        onClick={onOpen}
        style={{ display: "block", width: "100%", padding: 0, border: 0, background: "transparent", cursor: "pointer", textAlign: "left" }}
        aria-label={`Открыть ${product.name}`}
      >
        <img className="cardImg" src={product.image_url} alt={product.name} loading="lazy" />
      </button>
      <div className="cardBody">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <div className="title" style={{ fontSize: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.name}
          </div>
          <div className="price">{formatPrice(product.price)}</div>
        </div>
        <div className="muted2" style={{ fontSize: 13, lineHeight: 1.45, height: 38, overflow: "hidden" }}>
          {product.description}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 14 }}>
          <span className="badge">ID {product.id ?? "n/a"}</span>
          <button className="button" onClick={onAdd}>
            Add
          </button>
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

