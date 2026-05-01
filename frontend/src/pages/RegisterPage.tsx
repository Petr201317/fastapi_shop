import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, isApiError } from "../lib/api";
import { useToast } from "../components/Toast";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [entrepreneur, setEntrepreneur] = useState(false);
  const [inClub, setInClub] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const nav = useNavigate();

  return (
    <div className="page">
      <div className="container">
        <div className="glass panelPad" style={{ maxWidth: 560, margin: "0 auto" }}>
          <div className="title" style={{ fontSize: 20 }}>
            Register
          </div>
          <div className="muted" style={{ marginTop: 8 }}>
            After registration, you can sign in and use your cart.
          </div>
          <div className="hr" />

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                setLoading(true);
                await api.auth.register({
                  email: email.trim(),
                  password,
                  first_name: firstName.trim(),
                  last_name: lastName.trim() || null,
                  is_entrepreneur: entrepreneur,
                  in_club: inClub
                });
                toast.push({ kind: "ok", title: "Account created", message: "Now sign in" });
                nav("/login");
              } catch (err) {
                toast.push({ kind: "error", title: "Registration failed", message: isApiError(err) ? err.message : "Network error" });
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
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label style={{ display: "grid", gap: 8 }}>
                <span className="muted2" style={{ fontSize: 12 }}>
                  First name
                </span>
                <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
              </label>
              <label style={{ display: "grid", gap: 8 }}>
                <span className="muted2" style={{ fontSize: 12 }}>
                  Last name
                </span>
                <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
              </label>
            </div>

            <label className="badge" style={{ justifyContent: "space-between" }}>
              <span>I am an entrepreneur</span>
              <input type="checkbox" checked={entrepreneur} onChange={(e) => setEntrepreneur(e.target.checked)} />
            </label>
            <label className="badge" style={{ justifyContent: "space-between" }}>
              <span>I am in the club</span>
              <input type="checkbox" checked={inClub} onChange={(e) => setInClub(e.target.checked)} />
            </label>

            <button className="btn btnPrimary" disabled={loading} type="submit">
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <div className="muted" style={{ marginTop: 14 }}>
            Already have an account? <Link className="btn" to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

