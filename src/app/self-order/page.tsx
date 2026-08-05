"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category?: string;
  stock: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const rupiah = (n: number) => "Rp " + (n || 0).toLocaleString("id-ID");

function SelfOrderContent() {
  const params = useSearchParams();
  const branchId = params.get("branch") || "1";
  const mejaId = params.get("meja") || "";

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ kode: string; message: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/v1/guest_orders/menu?branch_id=${branchId}`)
      .then(async (res) => (res.ok ? res.json() : Promise.reject()))
      .then(setMenu)
      .catch(() => setError("Gagal memuat menu"))
      .finally(() => setLoading(false));
  }, [branchId]);

  const categories = [...new Set(menu.map((m) => m.category).filter(Boolean))];

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const found = prev.find((c) => c.id === item.id);
      if (found) {
        return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const found = prev.find((c) => c.id === id);
      if (!found) return prev;
      if (found.quantity <= 1) return prev.filter((c) => c.id !== id);
      return prev.map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c));
    });
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const submitOrder = async () => {
    if (!phone.trim()) {
      setError("Masukkan nomor HP terlebih dahulu");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/v1/guest_orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branch_id: Number(branchId),
          meja_id: mejaId ? Number(mejaId) : null,
          customer_phone: phone.trim(),
          customer_name: name.trim() || undefined,
          items: cart.map((c) => ({ product_id: c.id, quantity: c.quantity })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderResult({ kode: data.kode_transaksi, message: data.message });
        setCart([]);
      } else {
        setError(data.error || "Gagal mengirim pesanan");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderResult) {
    return (
      <div className="min-h-screen bg-[#131313] flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 text-center max-w-sm w-full bg-gray-900/90 border border-green-500/30">
          <span className="material-symbols-outlined text-green-400 text-6xl mb-4">check_circle</span>
          <h2 className="text-2xl font-bold font-[Montserrat] text-green-400 mb-2">Pesanan Diterima!</h2>
          <p className="text-gray-300 mb-4">{orderResult.message}</p>
          <div className="bg-gray-800 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-400">Kode Pesanan</p>
            <p className="text-2xl font-bold font-mono text-green-400">{orderResult.kode}</p>
          </div>
          <button
            onClick={() => setOrderResult(null)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
          >
            Pesan Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] text-gray-200 pb-28">
      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur sticky top-0 z-20 border-b border-gray-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-[Montserrat] text-green-400">Pesan Online</h1>
            <p className="text-xs text-gray-400">Meja {mejaId || "-"} • Scan QR untuk memesan</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold">
            {cart.reduce((s, c) => s + c.quantity, 0)} item
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Menu by category */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined text-green-400 text-5xl animate-pulse">restaurant_menu</span>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat} className="mb-6">
              <h3 className="text-lg font-semibold font-[Montserrat] text-gray-200 mb-3 border-b border-gray-800 pb-2">
                {cat}
              </h3>
              <div className="space-y-2">
                {menu
                  .filter((m) => m.category === cat)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between glass-card rounded-xl p-3 bg-gray-900/80 border border-gray-800">
                      <div>
                        <p className="font-medium text-gray-200">{item.name}</p>
                        <p className="text-sm text-green-400">{rupiah(item.price)}</p>
                        <p className="text-[10px] text-gray-500">Stok: {item.stock}</p>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={item.stock <= 0}
                        className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-white text-xl font-bold flex items-center justify-center active:scale-90 transition-transform"
                      >
                        +
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart bottom bar */}
      <div className="fixed bottom-0 inset-x-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 p-4 z-30 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto space-y-2">
          {cart.length > 0 && (
            <div className="max-h-32 overflow-y-auto space-y-1">
              {cart.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 flex-1 truncate mr-2">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeFromCart(c.id)} className="w-6 h-6 rounded-full bg-gray-700 text-gray-300 text-xs flex items-center justify-center">−</button>
                    <span className="w-6 text-center">{c.quantity}</span>
                    <button onClick={() => addToCart(c)} className="w-6 h-6 rounded-full bg-gray-700 text-gray-300 text-xs flex items-center justify-center">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="No. HP (wajib)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 min-w-0"
            />
            <input
              type="text"
              placeholder="Nama (opsional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 min-w-0 hidden sm:block"
            />
          </div>

          <button
            onClick={submitOrder}
            disabled={submitting || cart.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-3.5 rounded-xl font-bold text-base active:scale-95 transition-transform"
          >
            {submitting ? "Mengirim..." : `Pesan • ${rupiah(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SelfOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#131313] flex items-center justify-center">
          <span className="material-symbols-outlined text-green-400 text-5xl animate-pulse">restaurant_menu</span>
        </div>
      }
    >
      <SelfOrderContent />
    </Suspense>
  );
}
