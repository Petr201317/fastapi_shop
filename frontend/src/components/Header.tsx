import React from "react";
import { Link, NavLink } from "react-router-dom";
import type { User } from "../lib/types";
import { api } from "../lib/api";
import { useToast } from "./Toast";

export function Header({
  user,
  cartCount,
  query,
  onQueryChange,
  onSessionRefresh
}: {
  user: User | null;
  cartCount: number;
  query: string;
  onQueryChange: (v: string) => void;
  onSessionRefresh: () => Promise<void>;
}) {
  const toast = useToast();

  return (
    <header className="siteHeader">
      <div className="container">
        <div className="headerRow">
          <Link className="brand" to="/">
            <span>Amazone</span>
          </Link>
          <div className="headerSearch">
            <input
              className="input"
              placeholder="Search products by name..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
          </div>
          <nav className="headerNav">
            <NavLink className="linkButton" to="/cart">
              Cart ({cartCount})
            </NavLink>
            <NavLink className="linkButton" to="/orders">
              Orders
            </NavLink>
            <NavLink className="linkButton" to={user ? "/account" : "/login"}>
              {user ? "Account" : "Sign in"}
            </NavLink>
            {user?.is_entrepreneur ? (
              <NavLink className="button" to="/create">
                New product
              </NavLink>
            ) : null}
            <button
              className="linkButton"
              type="button"
              onClick={async () => {
                try {
                  await api.auth.refreshAccessToken();
                  await onSessionRefresh();
                  toast.push({ kind: "ok", title: "Session refreshed" });
                } catch {
                  toast.push({ kind: "error", title: "Refresh failed" });
                }
              }}
            >
              Refresh token
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

