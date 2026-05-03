import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastItem = { id: string; title: string; message?: string; kind?: "info" | "error" | "ok" };
type ToastApi = { push: (t: Omit<ToastItem, "id">) => void };

const ToastCtx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const value = useContext(ToastCtx);
  if (!value) throw new Error("useToast must be used within <ToastProvider />");
  return value;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const item: ToastItem = { id, ...t };
    setItems((prev) => [item, ...prev].slice(0, 3));
    window.setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 3600);
  }, []);

  const api = useMemo(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 1000, display: "grid", gap: 10 }}>
        {items.map((t) => (
          <div
            key={t.id}
            className="glass"
            style={{
              padding: 12,
              width: "min(420px, calc(100vw - 32px))",
              borderRadius: 16,
              borderColor:
                t.kind === "error"
                  ? "rgba(239, 68, 68, 0.35)"
                  : t.kind === "ok"
                    ? "rgba(34, 197, 94, 0.30)"
                    : "rgba(255,255,255,0.12)"
            }}
          >
            <div className="title" style={{ fontSize: 13 }}>
              {t.title}
            </div>
            {t.message ? (
              <div className="muted" style={{ marginTop: 6, fontSize: 12, lineHeight: 1.45 }}>
                {t.message}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

