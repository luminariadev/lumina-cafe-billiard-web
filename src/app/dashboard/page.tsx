'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getMejas, getTransaksis, getProducts, getReports,
  Meja, Transaksi, Product, ReportData,
} from "@/lib/api";
import MejaGrid from "@/components/MejaGrid";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [meja, setMeja] = useState<Meja[]>([]);
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getMejas().catch(() => [] as Meja[]),
      getTransaksis().catch(() => [] as Transaksi[]),
      getProducts().catch(() => [] as Product[]),
      getReports().catch(() => null),
    ]).then(([m, t, p, r]) => {
      setMeja(m);
      setTransaksis(t);
      setProducts(p);
      setReport(r);
      setLoading(false);
    });
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-6xl animate-pulse">🎱</div>
      </div>
    );
  }

  const aktifTransaksi = transaksis.filter((t) => t.status === "aktif");
  const tersediaMeja = meja.filter((m) => m.status === "tersedia");
  const totalProduk = products.length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const recentTransaksi = transaksis
    .filter((t) => t.status === "dibayar")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">
        Dashboard {user?.name ? `— ${user.name}` : ""}
      </h1>

      {/* Revenue Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="billiard-stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pendapatan Hari Ini</p>
              <p className="text-3xl font-bold text-amber-400">
                Rp {(report?.today_revenue || 0).toLocaleString()}
              </p>
            </div>
            <span className="text-4xl">💰</span>
          </div>
        </div>
        <div className="billiard-stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pendapatan Bulan Ini</p>
              <p className="text-3xl font-bold text-green-400">
                Rp {(report?.monthly_revenue || 0).toLocaleString()}
              </p>
            </div>
            <span className="text-4xl">📊</span>
          </div>
        </div>
        <div className="billiard-stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Meja Tersedia</p>
              <p className="text-3xl font-bold text-green-400">{tersediaMeja.length}</p>
            </div>
            <span className="text-4xl">🎱</span>
          </div>
        </div>
        <div className="billiard-stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Transaksi Aktif</p>
              <p className="text-3xl font-bold text-amber-400">{aktifTransaksi.length}</p>
            </div>
            <span className="text-4xl">📋</span>
          </div>
        </div>
      </div>

      {/* Second row stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="billiard-stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Produk</p>
              <p className="text-3xl font-bold text-blue-400">{totalProduk}</p>
            </div>
            <span className="text-4xl">🍽️</span>
          </div>
        </div>
        <div className="billiard-stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Transaksi Hari Ini</p>
              <p className="text-3xl font-bold text-amber-400">{report?.today_transactions || 0}</p>
            </div>
            <span className="text-4xl">📝</span>
          </div>
        </div>
        <div className="billiard-stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Transaksi Bulan Ini</p>
              <p className="text-3xl font-bold text-green-400">{report?.monthly_transactions || 0}</p>
            </div>
            <span className="text-4xl">📅</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Sellers */}
        <div className="billiard-card p-4">
          <h2 className="text-lg font-semibold text-white mb-3">🏆 Best Sellers</h2>
          {report?.best_sellers && report.best_sellers.length > 0 ? (
            <div className="space-y-2">
              {report.best_sellers.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-800/30 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-bold w-6">{i + 1}.</span>
                    <span className="text-sm text-white">{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">x{item.quantity}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">Belum ada data penjualan</p>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="billiard-card p-4">
          <h2 className="text-lg font-semibold text-white mb-3">
            ⚠️ Low Stock Products
            {lowStockProducts.length > 0 && (
              <span className="ml-2 text-sm text-yellow-400">({lowStockProducts.length})</span>
            )}
          </h2>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-2">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between bg-yellow-900/20 border border-yellow-800/30 rounded-lg px-3 py-2"
                >
                  <span className="text-sm text-white">{p.name}</span>
                  <span className="text-sm text-yellow-400 font-semibold">Sisa {p.stock}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">Semua stok aman ✅</p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Transaksi Terbaru</h2>
        <div className="grid gap-3">
          {recentTransaksi.slice(0, 5).map((t) => (
            <div key={t.id} className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-amber-400 font-mono text-sm">{t.kode_transaksi}</span>
                {t.meja && <span className="text-gray-400 text-sm">Meja {t.meja.nomor_meja}</span>}
                <span className="text-xs px-2 py-0.5 bg-amber-900/40 text-amber-300 rounded">{t.tipe}</span>
                {t.payment_method && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    t.payment_method === "cash" ? "bg-green-900/30 text-green-400" : "bg-blue-900/30 text-blue-400"
                  }`}>
                    {t.payment_method.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-green-400 text-sm font-semibold">
                  {t.total_bayar ? `Rp ${parseInt(t.total_bayar).toLocaleString()}` : "—"}
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(t.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          ))}
          {recentTransaksi.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">Belum ada transaksi</p>
          )}
        </div>
      </div>

      {/* Meja Status */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Status Meja</h2>
        <MejaGrid meja={meja} />
      </div>
    </div>
  );
}
