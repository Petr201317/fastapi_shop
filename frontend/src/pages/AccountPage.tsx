import React from "react";
import { Link } from "react-router-dom";
import type { User } from "../lib/types";

export function AccountPage({ user }: { user: User | null }) {
  return (
    <div className="page">
      <div className="container">
        <div className="glass panelPad">
          <div className="title" style={{ fontSize: 18 }}>
            Аккаунт
          </div>
          <div className="muted" style={{ marginTop: 8 }}>
            {user ? "Данные получены через /auth/me." : "Ты не авторизован."}
          </div>
          <div className="hr" />

          {user ? (
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="card" style={{ padding: 14 }}>
                <div className="muted2" style={{ fontSize: 12 }}>
                  Email
                </div>
                <div className="title" style={{ marginTop: 6 }}>
                  {user.email}
                </div>
              </div>
              <div className="card" style={{ padding: 14 }}>
                <div className="muted2" style={{ fontSize: 12 }}>
                  Пользователь
                </div>
                <div className="title" style={{ marginTop: 6 }}>
                  {user.first_name} {user.last_name ?? ""}
                </div>
                <div className="muted2" style={{ marginTop: 8, fontSize: 12 }}>
                  id: <b style={{ color: "rgba(255,255,255,0.9)" }}>{user.id}</b>
                </div>
              </div>
              <div className="card" style={{ padding: 14 }}>
                <div className="muted2" style={{ fontSize: 12 }}>
                  Статусы
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge">{user.in_club ? "Club member" : "No club"}</span>
                  <span className="badge">{user.is_entrepreneur ? "Entrepreneur" : "Customer"}</span>
                </div>
              </div>
              <div className="card" style={{ padding: 14 }}>
                <div className="muted2" style={{ fontSize: 12 }}>
                  Действия
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link className="btn" to="/cart">
                    Открыть корзину
                  </Link>
                  {user.is_entrepreneur ? (
                    <Link className="btn btnPrimary" to="/create">
                      Добавить товар
                    </Link>
                  ) : null}
                </div>
                <div className="muted2" style={{ marginTop: 10, fontSize: 12, lineHeight: 1.45 }}>
                  Logout эндпоинта нет — чтобы “выйти”, нужно удалить cookies в браузере.
                </div>
              </div>
            </div>
          ) : (
            <div className="muted">
              <Link className="btn btnPrimary" to="/login">
                Войти
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

