import React from "react";
import { Link, NavLink } from "react-router-dom";
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
          </nav>
        </div>
      </div>
    </header>
  );
}

