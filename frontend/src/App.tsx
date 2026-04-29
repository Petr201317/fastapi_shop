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
import { OrdersPage } from "./pages/OrdersPage";

function AppInner() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [query, setQuery] = useState("");
  useToast();

  const syncMe = useCallback(async () => {
    try {
      const me = await api.auth.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setAuthReady(true);
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
      <Header
        user={shell.user}
        cartCount={shell.cartCount}
        query={shell.query}
        onQueryChange={setQuery}
        onSessionRefresh={syncMe}
      />

      <Routes>
        <Route path="/" element={<HomePage query={query} onCartChanged={syncCartCount} />} />
        <Route path="/product/:id" element={<ProductPage onCartChanged={syncCartCount} />} />
        <Route
          path="/cart"
          element={<CartPage user={user} onCartChanged={syncCartCount} />}
        />
        <Route
          path="/login"
          element={<LoginPage onLoggedIn={async () => { await syncMe(); await syncCartCount(); }} />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<AccountPage user={user} />} />
        <Route path="/orders" element={<OrdersPage user={user} />} />
        <Route path="/create" element={<CreateProductPage user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!authReady ? <div className="loadingBar" /> : null}
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

