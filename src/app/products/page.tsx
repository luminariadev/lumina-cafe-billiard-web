'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getProducts, createProduct, getCategories, Product, Category } from "@/lib/api";

export default function ProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", stock: 0, category_id: 0, product_type: "minuman" });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && user?.role !== "admin") router.push("/dashboard");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [p, c] = await Promise.all([getProducts(), getCategories()]);
      setProducts(p);
      setCategories(c);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct({ ...form, price: form.price, category_id: Number(form.category_id) });
      setShowForm(false);
      setForm({ name: "", price: "", stock: 0, category_id: 0, product_type: "minuman" });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (authLoading || loading) return <div className="text-center py-20 text-6xl animate-pulse">🎱</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Produk</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          {showForm ? "Batal" : "+ Produk Baru"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-[#111d15] border border-gray-700 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="Nama Produk"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
              required
            />
            <input
              type="number"
              placeholder="Harga"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
              required
            />
            <input
              type="number"
              placeholder="Stok"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
            />
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
              required
            >
              <option value={0}>Pilih Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={form.product_type}
              onChange={(e) => setForm({ ...form, product_type: e.target.value })}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
            >
              <option value="minuman">Minuman</option>
              <option value="makanan">Makanan</option>
              <option value="snack">Snack</option>
              <option value="billiard">Billiard</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm">
            Simpan
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.map((p) => (
          <div key={p.id} className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
            <div className="text-xs text-amber-400 mb-1">{p.category?.name || "—"}</div>
            <div className="text-white font-medium">{p.name}</div>
            <div className="text-amber-400 font-bold mt-1">Rp {parseInt(p.price).toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">Stok: {p.stock}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
