export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string | null;
  in_club: boolean;
  is_entrepreneur: boolean;
  balance?: number | string;
};

export type Product = {
  id?: number;
  name: string;
  description: string;
  price: number | string;
  image_url: string;
  created_by_id?: number;
  created_at?: string;
};

export type CartItem = {
  id: string;
  product_id: number;
  quantity: number;
};

export type CartItemHydrated = CartItem & {
  product?: Product | null;
};

export type OrderItemCreate = {
  product_id: number;
  quantity: number;
};

export type OrderCreatePayload = {
  items: OrderItemCreate[];
};

export type OrderItem = {
  id?: string;
  product_id: number;
  quantity: number;
  price_at_purchase?: number | string;
};

export type Order = {
  id: string;
  user_id: number;
  total_price: number | string;
  status: "pending" | "shipped" | "cancelled" | string;
  items: OrderItem[];
  created_at?: string;
};

