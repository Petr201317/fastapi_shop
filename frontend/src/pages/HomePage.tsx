import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, isApiError } from "../lib/api";
import type { Product } from "../lib/types";
import { ProductCard } from "../components/ProductCard";
import { useToast } from "../components/Toast";

export function HomePage({
  query,
  onCartChanged
}: {
  query: string;
  onCartChanged: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const toast = useToast();
  const nav = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const cleanQuery = query.trim();
        const list = cleanQuery ? await api.products.search(cleanQuery, 24) : await api.products.list(24, 0);
        if (!cancelled) setProducts(list);
        if (!cancelled) setSearchMode(Boolean(cleanQuery));
      } catch (e) {
        toast.push({ kind: "error", title: "Failed to load products", message: isApiError(e) ? e.message : "Network error" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast, query]);

  const filtered = useMemo(() => {
    return products.filter((p) => p.name && p.description);
  }, [products]);

  return (
    <div className="page">
      <div className="container">
        <section className="heroPanel">
          <h1>Catalog</h1>
          <p>Professional storefront UI connected directly to your existing API.</p>
          <div className="metaLine">
            <span>{loading ? "Loading..." : `${filtered.length} products`}</span>
            <span>{searchMode ? "Server search: /products/search/{search_term}" : "List: /products"}</span>
          </div>
        </section>

        <div className="productsGrid">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card cardSkeleton" />
            ))
          ) : filtered.length ? (
            filtered.map((p) => (
              <ProductCard
                key={`${p.id ?? p.name}-${p.price}`}
                product={p}
                onOpen={() => {
                  if (!p.id) {
                    toast.push({ kind: "error", title: "Product details are unavailable for this item" });
                    return;
                  }
                  nav(`/product/${p.id}`);
                }}
                onAdd={async () => {
                  try {
                    if (!p.id) {
                      toast.push({ kind: "error", title: "Product ID missing in response" });
                      return;
                    }
                    await api.cart.add(p.id, 1);
                    toast.push({ kind: "ok", title: "Added to cart", message: p.name });
                    onCartChanged();
                  } catch (e) {
                    toast.push({ kind: "error", title: "Add to cart failed", message: isApiError(e) ? e.message : "Network error" });
                  }
                }}
              />
            ))
          ) : (
            <div className="panel">
              <div className="title">No products found</div>
              <div className="muted" style={{ marginTop: 8 }}>
                Try changing the search query.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

