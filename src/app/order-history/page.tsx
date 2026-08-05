"use client";

import { useState } from "react";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product?: { id: number; name: string };
}

interface Order {
  id: number;
  kode_transaksi: string;
  status: string;
  payment_method: string;
  total_amount: number;
  jam_mulai: string;
  transaksi_items?: OrderItem[];
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu",
  dibayar: "Dibayar",
  preparing: "Disiapkan",
  ready: "Siap",
  completed: "Selesai",
  batal: "Batal",
};

const rupiah = (n: number) => "Rp " + (n || 0).toLocaleString("id-ID");

export default function OrderHistoryPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const lookup = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setSearched(false);
    try {
      const res = await fetch(`/api/v1/guest_orders/status?phone=${encodeURIComponent(phone.trim())}`);
      if (res.ok) setOrders(await res.json());
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-gray-200 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold font-[Montserrat] text-green-400 mb-2">Riwayat Pesanan</h1>
        <p className="text-sm text-gray-400 mb-6">Masukkan nomor HP untuk melihat riwayat pesanan Anda</p>

        <div className="flex gap-2 mb-6">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            placeholder="Contoh: 081234567890"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
          <button
            onClick={lookup}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            {loading ? "..." : "Cari"}
          </button>
        </div>

        {searched && orders.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <span className="material-symbols-outlined text-6xl mb-4">receipt_long</span>
            <p>Tidak ada pesanan ditemukan untuk nomor ini</p>
          </div>
        )}

        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="glass-card rounded-xl p-4 bg-gray-900/80 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-bold font-mono text-green-400">{order.kode_transaksi}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.jam_mulai).toLocaleString("id-ID", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  order.status === "completed" ? "bg-green-500/20 text-green-400"
                  : order.status === "batal" ? "bg-red-500/20 text-red-400"
                  : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {STATUS_LABEL[order.status] || order.status}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {order.transaksi_items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.product?.name || `Item #${item.product_id}`}</span>
                    <span className="text-gray-400">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-800 pt-3">
                <span className="text-sm text-gray-400 capitalize">{order.payment_method}</span>
                <span className="font-bold text-green-400">{rupiah(order.total_amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
