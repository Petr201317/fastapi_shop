export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name?: string | null;
  in_club: boolean;
  is_entrepreneur: boolean;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  created_by_id: number;
  created_at?: string;
};

export type CartItem = {
  product_id: number;
  quantity: number;
};

export type CartItemHydrated = CartItem & {
  product?: Product | null;
};

