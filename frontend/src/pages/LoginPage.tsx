import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, isApiError } from "../lib/api";
import { useToast } from "../components/Toast";

export function LoginPage({ onLoggedIn }: { onLoggedIn: () => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const nav = useNavigate();

  return (
    <div className="page">
      <div className="container">
        <div className="glass panelPad" style={{ maxWidth: 560, margin: "0 auto" }}>
          <div className="title" style={{ fontSize: 20 }}>
            Sign in
          </div>
          <div className="muted" style={{ marginTop: 8 }}>
            Backend sets cookies on `/auth/login`. We use `credentials: include`.
          </div>
          <div className="hr" />

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                setLoading(true);
                await api.auth.login(email.trim(), password);
                await onLoggedIn();
                toast.push({ kind: "ok", title: "Done", message: "You are signed in" });
                nav("/");
              } catch (err) {
                toast.push({ kind: "error", title: "Sign in failed", message: isApiError(err) ? err.message : "Network error" });
              } finally {
                setLoading(false);
              }
            }}
            style={{ display: "grid", gap: 12 }}
          >
            <label style={{ display: "grid", gap: 8 }}>
              <span className="muted2" style={{ fontSize: 12 }}>
                Email
              </span>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </label>
            <label style={{ display: "grid", gap: 8 }}>
              <span className="muted2" style={{ fontSize: 12 }}>
                Password
              </span>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </label>
            <button className="btn btnPrimary" disabled={loading} type="submit">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="muted" style={{ marginTop: 14 }}>
            No account yet? <Link className="btn" to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

