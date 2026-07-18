const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: "admin" | "kasir_billiard" | "kasir_cafe";
}

export interface LoginResponse {
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

// Categories
export const getCategories = () => request<Category[]>("/categories");
export const createCategory = (data: Partial<Category>) =>
  request<Category>("/categories", { method: "POST", body: JSON.stringify(data) });

// Products
export const getProducts = () => request<Product[]>("/products");
export const createProduct = (data: Partial<Product>) =>
  request<Product>("/products", { method: "POST", body: JSON.stringify(data) });

// Meja
export const getMejas = () => request<Meja[]>("/mejas");
export const updateMejaStatus = (id: number, status: string) =>
  request<Meja>(`/mejas/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// Transaksi
export const getTransaksis = () => request<Transaksi[]>("/transaksis");
export const createTransaksi = (data: { meja_id?: number; tipe: string; nama_pelanggan?: string }) =>
  request<Transaksi>("/transaksis", { method: "POST", body: JSON.stringify(data) });
export const bayarTransaksi = (id: number) =>
  request<Transaksi>(`/transaksis/${id}/bayar`, { method: "POST" });

// Transaksi Items
export const addItem = (transaksiId: number, data: { product_id: number; qty: number }) =>
  request<TransaksiItem>(`/transaksis/${transaksiId}/items`, {
    method: "POST",
    body: JSON.stringify(data),
  });

// Cafe POS
export const cafePos = (payment_method: "cash" | "qris", items: Record<string, number>) =>
  request<Transaksi>("/transaksis/cafe_pos", {
    method: "POST",
    body: JSON.stringify({ payment_method, items }),
  });

// Reports
export interface ReportData {
  today_revenue: number;
  monthly_revenue: number;
  best_sellers: { name: string; quantity: number }[];
  today_transactions: number;
  monthly_transactions: number;
}

export const getReports = () =>
  request<ReportData>("/reports");

// Report
export const getReport = () => request("/transaksis/report");
