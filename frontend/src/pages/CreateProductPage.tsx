import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, isApiError } from "../lib/api";
import type { User } from "../lib/types";
import { useToast } from "../components/Toast";

export function CreateProductPage({ user }: { user: User | null }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(1990);
  const [imageUrl, setImageUrl] = useState("https://picsum.photos/seed/amazone/1200/800");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const nav = useNavigate();

  const validation = useMemo(() => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedUrl = imageUrl.trim();

    const issues: string[] = [];
    if (trimmedName.length < 5) issues.push("Name must be at least 5 characters");
    if (trimmedDescription.length < 15) issues.push("Description must be at least 15 characters");
    if (!Number.isFinite(price) || price <= 0) issues.push("Price must be greater than 0");
    try {
      // eslint-disable-next-line no-new
      new URL(trimmedUrl);
    } catch {
      issues.push("Image must be a valid URL");
    }

    return {
      ok: issues.length === 0,
      issues,
      payload: {
        name: trimmedName,
        description: trimmedDescription,
        price: Number(price),
        image_url: trimmedUrl
      }
    };
  }, [name, description, price, imageUrl]);

  if (!user) {
    return (
      <div className="page">
        <div className="container">
          <div className="glass panelPad">
            <div className="title">Authorization required</div>
            <div className="muted" style={{ marginTop: 8 }}>
              <Link className="btn btnPrimary" to="/login">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user.is_entrepreneur) {
    return (
      <div className="page">
        <div className="container">
          <div className="glass panelPad">
            <div className="title">Unavailable</div>
            <div className="muted" style={{ marginTop: 8 }}>
              Product creation is available only for users with `is_entrepreneur=true`.
            </div>
            <div className="muted" style={{ marginTop: 12 }}>
              <Link className="btn" to="/">
                Back to home
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
          <div className="glass panelPad">
            <div className="title" style={{ fontSize: 18 }}>
              New product
            </div>
            <div className="muted" style={{ marginTop: 8 }}>
              POST `/products/create` (cookies auth).
            </div>
            <div className="hr" />

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!validation.ok) {
                  toast.push({ kind: "error", title: "Check fields", message: validation.issues.join("; ") });
                  return;
                }
                try {
                  setLoading(true);
                  const p = await api.products.create(validation.payload);
                  toast.push({ kind: "ok", title: "Product created", message: p.name });
                  if (p.id) {
                    nav(`/product/${p.id}`);
                  } else {
                    nav("/");
                  }
                } catch (err) {
                  toast.push({
                    kind: "error",
                    title: "Create failed",
                    message: isApiError(err) ? err.message : "Network error"
                  });
                } finally {
                  setLoading(false);
                }
              }}
              style={{ display: "grid", gap: 12 }}
            >
              <label style={{ display: "grid", gap: 8 }}>
                <span className="muted2" style={{ fontSize: 12 }}>
                  Name
                </span>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Example: Pro Max Headphones"
                />
              </label>
              <label style={{ display: "grid", gap: 8 }}>
                <span className="muted2" style={{ fontSize: 12 }}>
                  Description
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: 110,
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    padding: 12,
                    background: "rgba(0,0,0,0.18)",
                    color: "var(--text)"
                  }}
                  placeholder="Short and clear product description..."
                />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label style={{ display: "grid", gap: 8 }}>
                  <span className="muted2" style={{ fontSize: 12 }}>
                    Price (USD)
                  </span>
                  <input
                    className="input"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </label>
                <label style={{ display: "grid", gap: 8 }}>
                  <span className="muted2" style={{ fontSize: 12 }}>
                    Image URL
                  </span>
                  <input className="input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </label>
              </div>

              {!validation.ok ? (
                <div
                  className="badge"
                  style={{ borderColor: "rgba(239, 68, 68, 0.35)", color: "rgba(255,255,255,0.82)" }}
                >
                  {validation.issues.join(" • ")}
                </div>
              ) : (
                <div
                  className="badge"
                  style={{ borderColor: "rgba(34, 197, 94, 0.30)", color: "rgba(255,255,255,0.82)" }}
                >
                  Ready to create
                </div>
              )}

              <button className="btn btnPrimary" type="submit" disabled={loading || !validation.ok}>
                {loading ? "Creating..." : "Create"}
              </button>
              <Link className="btn" to="/">
                Cancel
              </Link>
            </form>
          </div>

          <div className="glass panelPad">
            <div className="title">Preview</div>
            <div className="muted" style={{ marginTop: 8 }}>
              How this item will look in the product card.
            </div>
            <div className="hr" />
            <div className="card">
              <img className="cardImg" style={{ height: 240 }} src={imageUrl} alt="preview" />
              <div className="cardBody">
                <div className="title" style={{ fontSize: 14 }}>
                  {name || "Product name"}
                </div>
                <div className="muted2" style={{ marginTop: 8, fontSize: 12, lineHeight: 1.45 }}>
                  {description || "Product description..."}
                </div>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="badge">seller: {user.id}</span>
                  <span className="price">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0
                    }).format(price || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

