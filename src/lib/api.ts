const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export interface User {
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

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  price: string;
  stock: number;
  product_type: string;
  category?: Category;
}

export interface Meja {
  id: number;
  nomor_meja: number;
  status: "tersedia" | "dipakai" | "maintenance";
  keterangan: string;
}

export interface Transaksi {
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

export interface TransaksiItem {
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

// Guest History
export interface GuestHistoryItem {
  id: number;
  kode_transaksi: string;
  customer_name: string;
  customer_phone: string;
  transaksi_type: string;
  total_amount: number;
  status: string;
  payment_method: string;
  jam_mulai: string;
  jam_selesai: string | null;
  created_at: string;
  meja?: { nomor_meja: number };
  transaksi_items?: {
    id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product?: { name: string };
  }[];
}

export const getGuestHistory = (phone: string) =>
  request<GuestHistoryItem[]>(`/guest_transactions/history?phone=${encodeURIComponent(phone)}`);

// ---- Missing exports needed by pages ----

// Products
export const getProducts = () => request<Product[]>("/products");
export const createProduct = (data: Partial<Product>) =>
  request<Product>("/products", { method: "POST", body: JSON.stringify(data) });
export const updateProduct = (id: number, data: Partial<Product>) =>
  request<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteProduct = (id: number) =>
  request<void>(`/products/${id}`, { method: "DELETE" });

// Categories
export const getCategories = () => request<Category[]>("/categories");
export const createCategory = (data: Partial<Category>) =>
  request<Category>("/categories", { method: "POST", body: JSON.stringify(data) });
export const updateCategory = (id: number, data: Partial<Category>) =>
  request<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteCategory = (id: number) =>
  request<void>(`/categories/${id}`, { method: "DELETE" });

// Meja
export const getMejas = () => request<Meja[]>("/mejas");
export const updateMejaStatus = (id: number, status: string) =>
  request<Meja>(`/mejas/${id}`, { method: "PUT", body: JSON.stringify({ status }) });

// Transaksis
export const getTransaksis = () => request<Transaksi[]>("/transaksis");
export const createTransaksi = (data: Partial<Transaksi>) =>
  request<Transaksi>("/transaksis", { method: "POST", body: JSON.stringify(data) });
export const getTransactionsReport = (from?: string, to?: string) => {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString() ? "?" + params.toString() : "";
  return request<Transaksi[]>(`/transaksis/report${qs}`);
};

// Reports
export interface ReportData {
  today_revenue: number;
  monthly_revenue: number;
  best_sellers: { name: string; quantity: number }[];
  today_transactions: number;
  monthly_transactions: number;
}
export const getReports = (params?: { start_date?: string; end_date?: string }) => {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  return request<ReportData>(`/reports${qs}`);
};

// POS
export const cafePos = (payment_method: string, items: Record<string, number>, customer_name?: string) =>
  request<GuestHistoryItem>("/guest_transactions/cafe", {
    method: "POST",
    body: JSON.stringify({ customer_name, items, payment_method }),
  });