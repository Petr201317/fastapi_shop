import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { ToastProvider, useToast } from "./components/Toast";
import { api } from "./lib/api";
import type { User } from "./lib/types";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AccountPage } from "./pages/AccountPage";
import { CreateProductPage } from "./pages/CreateProductPage";

function AppInner() {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [query, setQuery] = useState("");
  const toast = useToast();

  const syncMe = useCallback(async () => {
    try {
      const me = await api.auth.me();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  const syncCartCount = useCallback(async () => {
    try {
      const cart = await api.cart.get();
      setCartCount(cart.reduce((sum, x) => sum + (x.quantity ?? 0), 0));
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    // initial load
    void syncMe();
    void syncCartCount();
  }, [syncMe, syncCartCount]);

  const shell = useMemo(() => ({ user, cartCount, query }), [user, cartCount, query]);

  return (
    <>
      <Header user={shell.user} cartCount={shell.cartCount} query={shell.query} onQueryChange={setQuery} />

      <Routes>
        <Route path="/" element={<HomePage query={query} onCartChanged={syncCartCount} />} />
        <Route path="/product/:id" element={<ProductPage onCartChanged={syncCartCount} />} />
        <Route path="/cart" element={<CartPage onCartChanged={syncCartCount} />} />
        <Route path="/login" element={<LoginPage onLoggedIn={async () => { await syncMe(); await syncCartCount(); }} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<AccountPage user={user} />} />
        <Route path="/create" element={<CreateProductPage user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <div className="container" style={{ paddingBottom: 44 }}>
        <div className="muted2" style={{ fontSize: 12, marginTop: 18, textAlign: "center" }}>
          UI demo • backend via proxy • cookies auth • если видишь 401 — сначала зайди, затем обнови страницу.
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}

