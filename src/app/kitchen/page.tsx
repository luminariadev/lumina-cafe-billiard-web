"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  product: { id: number; name: string };
  quantity: number;
  subtotal: number;
}

interface Order {
  id: number;
  kode_transaksi: string;
  status: string;
  jam_mulai: string;
  transaksi_items: OrderItem[];
  meja?: { id: number; no_meja: string; nama: string } | null;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu",
  dibayar: "Dibayar",
  preparing: "Disiapkan",
  ready: "Siap",
  completed: "Selesai",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  dibayar: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  preparing: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  ready: "bg-green-500/20 text-green-400 border-green-500/40",
  completed: "bg-gray-500/20 text-gray-400 border-gray-500/40",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} mnt lalu`;
  return `${Math.floor(mins / 60)} j lalu`;
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/orders/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setOrders(await res.json());
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // auto-refresh 10s
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: number, status: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/v1/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch {
      /* silent */
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131313]">
        <span className="material-symbols-outlined text-green-400 text-5xl animate-pulse">restaurant</span>
      </div>
    );
  }

  const activeOrders = orders.filter((o) => o.status !== "completed");

  return (
    <div className="min-h-screen bg-[#131313] text-gray-200 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-[Montserrat] text-green-400">Kitchen Display</h1>
            <p className="text-sm text-gray-400 mt-1">Auto-refresh setiap 10 detik</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
            {activeOrders.length} aktif
          </span>
        </div>

        {activeOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <span className="material-symbols-outlined text-6xl mb-4">done_all</span>
            <p className="text-lg">Tidak ada pesanan aktif</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <div key={order.id} className="glass-card rounded-xl p-4 border border-gray-800 bg-gray-900/80">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-green-400 font-[Montserrat]">{order.kode_transaksi}</p>
                    <p className="text-xs text-gray-400">{timeAgo(order.jam_mulai)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${STATUS_COLOR[order.status] || ""}`}>
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-1">
                    Meja: {order.meja?.nama || order.meja?.no_meja || "-"}
                  </p>
                  <div className="space-y-1">
                    {order.transaksi_items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.product?.name || `Item #${item.product_id}`}</span>
                        <span className="text-gray-400">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {order.status === "pending" || order.status === "dibayar" ? (
                    <button
                      onClick={() => updateStatus(order.id, "preparing")}
                      className="col-span-3 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold text-sm active:scale-95 transition-transform"
                    >
                      Terima & Mulai
                    </button>
                  ) : order.status === "preparing" ? (
                    <button
                      onClick={() => updateStatus(order.id, "ready")}
                      className="col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm active:scale-95 transition-transform"
                    >
                      Siap Saji
                    </button>
                  ) : order.status === "ready" ? (
                    <button
                      onClick={() => updateStatus(order.id, "completed")}
                      className="col-span-3 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-sm active:scale-95 transition-transform"
                    >
                      Sudah Diantar
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
