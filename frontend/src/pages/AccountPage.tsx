import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api, isApiError } from "../lib/api";
import { useToast } from "../components/Toast";
import type { User } from "../lib/types";

export function AccountPage({ user, onUserChanged }: { user: User | null; onUserChanged: () => Promise<void> }) {
  const [topUpAmount, setTopUpAmount] = useState<number>(1000);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const toast = useToast();

  return (
    <div className="page">
      <div className="container">
        <div className="glass panelPad">
          <div className="title" style={{ fontSize: 18 }}>
            Account
          </div>
          <div className="muted" style={{ marginTop: 8 }}>
            {user ? "Data loaded from /auth/me." : "You are not signed in."}
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
                  User
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
                  Status
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge">{user.in_club ? "Club member" : "No club"}</span>
                  <span className="badge">{user.is_entrepreneur ? "Entrepreneur" : "Customer"}</span>
                </div>
              </div>
              <div className="card" style={{ padding: 14 }}>
                <div className="muted2" style={{ fontSize: 12 }}>
                  Balance
                </div>
                <div className="title" style={{ marginTop: 6 }}>
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(user.balance ?? 0) || 0)}
                </div>
                <div className="muted2" style={{ marginTop: 8, fontSize: 12 }}>
                  Top up via `POST /auth/top_up`
                </div>
                <div style={{ marginTop: 10, display: "grid", gap: 8, gridTemplateColumns: "1fr auto" }}>
                  <input
                    className="input"
                    type="number"
                    min={1}
                    step={1}
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    placeholder="Amount"
                  />
                  <button
                    className="btn btnPrimary"
                    disabled={topUpLoading || !Number.isFinite(topUpAmount) || topUpAmount <= 0}
                    onClick={async () => {
                      try {
                        setTopUpLoading(true);
                        const newBalance = await api.auth.topUp(topUpAmount);
                        await onUserChanged();
                        toast.push({
                          kind: "ok",
                          title: "Balance topped up",
                          message: `New balance: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(newBalance) || 0)}`
                        });
                      } catch (err) {
                        toast.push({
                          kind: "error",
                          title: "Top up failed",
                          message: isApiError(err) ? err.message : "Network error"
                        });
                      } finally {
                        setTopUpLoading(false);
                      }
                    }}
                  >
                    {topUpLoading ? "Topping up..." : "Top up"}
                  </button>
                </div>
              </div>
              <div className="card" style={{ padding: 14 }}>
                <div className="muted2" style={{ fontSize: 12 }}>
                  Actions
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link className="btn" to="/cart">
                    Open cart
                  </Link>
                  {user.is_entrepreneur ? (
                    <Link className="btn btnPrimary" to="/create">
                      Add product
                    </Link>
                  ) : null}
                </div>
                <div className="muted2" style={{ marginTop: 10, fontSize: 12, lineHeight: 1.45 }}>
                  There is no logout endpoint. To sign out, clear browser cookies.
                </div>
              </div>
            </div>
          ) : (
            <div className="muted">
              <Link className="btn btnPrimary" to="/login">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

