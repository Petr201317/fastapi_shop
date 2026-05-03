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
        if (!Number.isFinite(productId)) throw new Error("Invalid product id");
        const p = await api.products.byId(productId);
        if (!cancelled) setProduct(p);
      } catch (e) {
        toast.push({ kind: "error", title: "Product not found", message: isApiError(e) ? e.message : "Network error" });
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
          <div className="panel" style={{ height: 460 }} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <div className="container">
          <div className="panel">
            <div className="title">Unable to load product</div>
            <div className="muted" style={{ marginTop: 8 }}>
              <Link className="linkButton" to="/">
                Back to catalog
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
        <div className="layoutSplit">
          <div className="card">
            <img className="cardImg" style={{ height: 420 }} src={product.image_url} alt={product.name} />
          </div>
          <div className="panel">
            <div className="badge">Product #{product.id}</div>
            <div className="title" style={{ fontSize: 22, marginTop: 10 }}>
              {product.name}
            </div>
            <div className="muted" style={{ marginTop: 10, lineHeight: 1.55 }}>
              {product.description}
            </div>
            <div className="hr" />
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <div className="muted">Price</div>
              <div className="price" style={{ fontSize: 26 }}>
                {formatPrice(product.price)}
              </div>
            </div>
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <button
                className="button"
                onClick={async () => {
                  try {
                    if (!product.id) throw new Error("Product ID missing");
                    await api.cart.add(product.id, 1);
                    toast.push({ kind: "ok", title: "Added to cart", message: product.name });
                    onCartChanged();
                  } catch (e) {
                    toast.push({ kind: "error", title: "Unable to add item", message: isApiError(e) ? e.message : "Network error" });
                  }
                }}
              >
                Add to cart
              </button>
              <Link className="linkButton" to="/cart">
                Go to cart
              </Link>
              <Link className="linkButton" to="/">
                Continue shopping
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

