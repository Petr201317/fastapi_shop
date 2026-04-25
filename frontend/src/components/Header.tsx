import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IconCart, IconSearch, IconUser, IconPlus } from "./Icons";
import type { User } from "../lib/types";

export function Header({
  user,
  cartCount,
  query,
  onQueryChange
}: {
  user: User | null;
  cartCount: number;
  query: string;
  onQueryChange: (v: string) => void;
}) {
  const nav = useNavigate();

  return (
    <div className="topbar">
      <div className="container">
        <div className="topbarInner">
          <Link className="logo" to="/">
            <div className="logoMark" />
            <div className="logoText">
              <b>Amazone</b>
              <span>marketplace</span>
            </div>
          </Link>

          <div className="searchWrap">
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.55)" }}>
                <IconSearch />
              </div>
              <input
                className="input"
                style={{ paddingLeft: 40 }}
                placeholder="Поиск товаров, брендов и категорий…"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
              />
            </div>
          </div>

          {user?.is_entrepreneur ? (
            <button className="btn" onClick={() => nav("/create")}>
              <IconPlus />
              Добавить
            </button>
          ) : null}

          <NavLink className="btn" to="/cart">
            <IconCart />
            Корзина
            <span className="badge" style={{ padding: "4px 8px", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
              {cartCount}
            </span>
          </NavLink>

          <NavLink className="btn" to={user ? "/account" : "/login"}>
            <IconUser />
            {user ? "Аккаунт" : "Войти"}
          </NavLink>
        </div>
      </div>
    </div>
  );
}

