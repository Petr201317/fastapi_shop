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
    if (trimmedName.length < 5) issues.push("Название минимум 5 символов");
    if (trimmedDescription.length < 15) issues.push("Описание минимум 15 символов");
    if (!Number.isFinite(price) || price <= 0) issues.push("Цена должна быть > 0");
    try {
      // eslint-disable-next-line no-new
      new URL(trimmedUrl);
    } catch {
      issues.push("Картинка должна быть валидным URL");
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
            <div className="title">Нужна авторизация</div>
            <div className="muted" style={{ marginTop: 8 }}>
              <Link className="btn btnPrimary" to="/login">
                Войти
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
            <div className="title">Недоступно</div>
            <div className="muted" style={{ marginTop: 8 }}>
              Создание продукта доступно только пользователю с `is_entrepreneur=true`.
            </div>
            <div className="muted" style={{ marginTop: 12 }}>
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
          <div className="glass panelPad">
            <div className="title" style={{ fontSize: 18 }}>
              Новый товар
            </div>
            <div className="muted" style={{ marginTop: 8 }}>
              POST `/products/create` (cookies auth).
            </div>
            <div className="hr" />

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!validation.ok) {
                  toast.push({ kind: "error", title: "Проверь поля", message: validation.issues.join("; ") });
                  return;
                }
                try {
                  setLoading(true);
                  const p = await api.products.create(validation.payload);
                  toast.push({ kind: "ok", title: "Товар создан", message: p.name });
                  if (p.id) {
                    nav(`/product/${p.id}`);
                  } else {
                    nav("/");
                  }
                } catch (err) {
                  toast.push({
                    kind: "error",
                    title: "Не удалось создать",
                    message: isApiError(err) ? err.message : "Ошибка сети"
                  });
                } finally {
                  setLoading(false);
                }
              }}
              style={{ display: "grid", gap: 12 }}
            >
              <label style={{ display: "grid", gap: 8 }}>
                <span className="muted2" style={{ fontSize: 12 }}>
                  Название
                </span>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например: Наушники Pro Max"
                />
              </label>
              <label style={{ display: "grid", gap: 8 }}>
                <span className="muted2" style={{ fontSize: 12 }}>
                  Описание
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
                  placeholder="Коротко и по делу, как на маркетплейсе…"
                />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label style={{ display: "grid", gap: 8 }}>
                  <span className="muted2" style={{ fontSize: 12 }}>
                    Цена (RUB)
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
                    Картинка URL
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
                  Готово к созданию
                </div>
              )}

              <button className="btn btnPrimary" type="submit" disabled={loading || !validation.ok}>
                {loading ? "Создаём…" : "Создать"}
              </button>
              <Link className="btn" to="/">
                Отмена
              </Link>
            </form>
          </div>

          <div className="glass panelPad">
            <div className="title">Превью</div>
            <div className="muted" style={{ marginTop: 8 }}>
              Как это будет выглядеть в карточке.
            </div>
            <div className="hr" />
            <div className="card">
              <img className="cardImg" style={{ height: 240 }} src={imageUrl} alt="preview" />
              <div className="cardBody">
                <div className="title" style={{ fontSize: 14 }}>
                  {name || "Название товара"}
                </div>
                <div className="muted2" style={{ marginTop: 8, fontSize: 12, lineHeight: 1.45 }}>
                  {description || "Описание товара…"}
                </div>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="badge">seller: {user.id}</span>
                  <span className="price">
                    {new Intl.NumberFormat("ru-RU", {
                      style: "currency",
                      currency: "RUB",
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

