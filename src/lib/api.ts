const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  role_label?: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
}

interface Product {
  id: number;
  category_id: number;
  name: string;
  price: string;
  stock: number;
  product_type: string;
  category?: Category;
}

interface Meja {
  id: number;
  nomor_meja: number;
  status: "tersedia" | "dipakai" | "maintenance";
  keterangan: string;
}

interface Transaksi {
  id: number;
  kode_transaksi: string;
  user_id: number;
  meja_id: number | null;
  tipe: "billiard" | "cafe";
  total_bayar: string | null;
  status: "aktif" | "selesai" | "dibayar";
  nama_pelanggan: string | null;
  payment_method?: "cash" | "qris";
  transaction_date?: string;
  total_price?: string;
  created_at: string;
  user?: { name: string };
  meja?: Meja;
  transaksi_items?: TransaksiItem[];
}

interface TransaksiItem {
  id: number;
  transaksi_id: number;
  product_id: number;
  qty: number;
  harga_satuan: string;
  subtotal: string;
  product?: Product;
}

interface AppConfig {
  app_name: string;
  version: string;
  billiard: {
    price_per_hour: number;
    currency: string;
    min_duration_hour: number;
    max_duration_hour: number;
  };
  operating_hours: {
    open: string;
    close: string;
    timezone: string;
  };
  payment: {
    methods: string[];
    qris_expiry_minutes: number;
  };
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// Auth
export const login = (username: string, password: string) =>
  request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

// Configs
export const getAppConfig = () => request<AppConfig>("/configs");