import type {
  CartItem,
  Order,
  OrderCreatePayload,
  Product,
  User
} from "./types";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiError = {
  status: number;
  message: string;
};

type FastApiValidationError = {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
};

function normalizeDetail(detail: unknown): string | null {
  if (!detail) return null;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const items = detail as FastApiValidationError[];
    const lines = items
      .slice(0, 3)
      .map((x) => {
        const loc = Array.isArray(x.loc) ? x.loc.join(".") : "body";
        const msg = x.msg ?? "Validation error";
        return `${loc}: ${msg}`;
      })
      .filter(Boolean);
    return lines.length ? lines.join("; ") : "Validation error";
  }
  if (typeof detail === "object") {
    return "Request error";
  }
  return null;
}

async function readJsonSafe<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const res = await fetch("/auth/refresh_access_token", {
    method: "GET",
    credentials: "include"
  });
  return res.ok;
}

async function request<T>(
  path: string,
  init: {
    method: HttpMethod;
    body?: unknown;
    retryOn401?: boolean;
  }
): Promise<T> {
  const res = await fetch(path, {
    method: init.method,
    credentials: "include",
    headers: init.body ? { "Content-Type": "application/json" } : undefined,
    body: init.body ? JSON.stringify(init.body) : undefined
  });

  if (res.status === 401 && init.retryOn401 !== false) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const retry = await fetch(path, {
        method: init.method,
        credentials: "include",
        headers: init.body ? { "Content-Type": "application/json" } : undefined,
        body: init.body ? JSON.stringify(init.body) : undefined
      });
      if (!retry.ok) {
        const payload = await readJsonSafe<{ detail?: unknown }>(retry);
        throw { status: retry.status, message: normalizeDetail(payload?.detail) ?? retry.statusText } satisfies ApiError;
      }
      const data = (await readJsonSafe<T>(retry)) as T | null;
      return (data ?? (undefined as unknown as T));
    }
  }

  if (!res.ok) {
    const payload = await readJsonSafe<{ detail?: unknown }>(res);
    throw { status: res.status, message: normalizeDetail(payload?.detail) ?? res.statusText } satisfies ApiError;
  }
  const data = (await readJsonSafe<T>(res)) as T | null;
  return (data ?? (undefined as unknown as T));
}

export const api = {
  auth: {
    async me(): Promise<User> {
      return request<User>("/auth/me", { method: "GET" });
    },
    async login(email: string, password: string): Promise<void> {
      await request<unknown>("/auth/login", { method: "POST", body: { email, password }, retryOn401: false });
    },
    async register(payload: {
      email: string;
      password: string;
      first_name: string;
      last_name?: string | null;
      is_entrepreneur?: boolean;
      in_club?: boolean;
    }): Promise<User> {
      return request<User>("/auth/reg", { method: "POST", body: payload, retryOn401: false });
    },
    async refreshAccessToken(): Promise<void> {
      await request<void>("/auth/refresh_access_token", { method: "GET", retryOn401: false });
    }
  },
  products: {
    async list(limit = 24, offset = 0): Promise<Product[]> {
      return request<Product[]>(`/products/?limit=${limit}&offset=${offset}`, { method: "GET" });
    },
    async byId(id: number): Promise<Product> {
      return request<Product>(`/products/${id}`, { method: "GET" });
    },
    async search(searchTerm: string, limit = 10): Promise<Product[]> {
      return request<Product[]>(
        `/products/search/${encodeURIComponent(searchTerm)}?limit=${limit}`,
        { method: "GET" }
      );
    },
    async create(payload: { name: string; description: string; price: number; image_url: string }): Promise<Product> {
      return request<Product>("/products/create", { method: "POST", body: payload });
    }
  },
  cart: {
    async get(): Promise<CartItem[]> {
      return request<CartItem[]>("/cart/cart", { method: "GET" });
    },
    async add(productId: number, quantity: number): Promise<unknown> {
      return request("/cart/add_product", { method: "POST", body: { product_id: productId, quantity } });
    },
    async remove(cartItemId: string): Promise<CartItem | null> {
      return request<CartItem | null>(
        `/cart/del_product?cart_item_id=${encodeURIComponent(cartItemId)}`,
        { method: "POST" }
      );
    }
  },
  orders: {
    async list(): Promise<Order[]> {
      return request<Order[]>("/orders/", { method: "GET" });
    },
    async create(payload: OrderCreatePayload): Promise<boolean> {
      return request<boolean>("/orders/create", { method: "POST", body: payload });
    }
  }
};

export function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "message" in err &&
    typeof (err as any).status === "number" &&
    typeof (err as any).message === "string"
  );
}
