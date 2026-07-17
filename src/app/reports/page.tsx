'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getReports, getTransaksis, ReportData, Transaksi } from "@/lib/api";

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  // Date filter
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && user?.role !== "admin") router.push("/dashboard");
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      const [r, t] = await Promise.all([
        getReports().catch(() => null),
        getTransaksis(),
      ]);
      setReport(r);
      setTransaksis(t);
    } catch (e: unknown) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    if (user) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Filter transaksis by date range + only dibayar
  const filteredTrans = transaksis
    .filter((t) => t.status === "dibayar")
    .filter((t) => {
      if (!dateFrom && !dateTo) return true;
      const date = new Date(t.created_at);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo + "T23:59:59") : null;
      if (from && date < from) return false;
      if (to && date > to) return false;
      return true;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredTotal = filteredTrans.reduce(
    (sum, t) => sum + parseInt(t.total_bayar || "0"), 0
  );

  if (authLoading || loading) return <div className="text-center py-20 text-6xl animate-pulse">🎱</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Laporan</h1>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="billiard-stat">
          <p className="text-gray-400 text-sm">Pendapatan Hari Ini</p>
          <p className="text-3xl font-bold text-amber-400">
            Rp {(report?.today_revenue || 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {report?.today_transactions || 0} transaksi
          </p>
        </div>
        <div className="billiard-stat">
          <p className="text-gray-400 text-sm">Pendapatan Bulan Ini</p>
          <p className="text-3xl font-bold text-green-400">
            Rp {(report?.monthly_revenue || 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {report?.monthly_transactions || 0} transaksi
          </p>
        </div>
        <div className="billiard-stat">
          <p className="text-gray-400 text-sm">Filtered Total</p>
          <p className="text-3xl font-bold text-blue-400">
            Rp {filteredTotal.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {filteredTrans.length} transaksi (filter)
          </p>
        </div>
        <div className="billiard-stat">
          <p className="text-gray-400 text-sm">Total Transaksi</p>
          <p className="text-3xl font-bold text-white">
            {transaksis.filter((t) => t.status === "dibayar").length}
          </p>
          <p className="text-xs text-gray-500 mt-1">semua status dibayar</p>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="billiard-card p-4">
          <h2 className="text-lg font-semibold text-white mb-3">🏆 Best Sellers</h2>
          {report?.best_sellers && report.best_sellers.length > 0 ? (
            <div className="space-y-2">
              {report.best_sellers.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-800/30 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-bold w-6">{i + 1}.</span>
                    <span className="text-sm text-white">{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">Terjual: {item.quantity}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">Belum ada data penjualan</p>
          )}
        </div>

        {/* Summary */}
        <div className="billiard-card p-4">
          <h2 className="text-lg font-semibold text-white mb-3">📊 Ringkasan</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Transaksi Billiard</span>
              <span className="text-white font-semibold">
                {transaksis.filter((t) => t.tipe === "billiard" && t.status === "dibayar").length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Transaksi Cafe</span>
              <span className="text-white font-semibold">
                {transaksis.filter((t) => t.tipe === "cafe" && t.status === "dibayar").length}
              </span>
            </div>
            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-200">Total Produk Terjual</span>
                <span className="text-amber-400">
                  {report?.best_sellers.reduce((sum, s) => sum + s.quantity, 0) || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter + Transactions Table */}
      <div className="billiard-card overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-3">Riwayat Transaksi</h2>
          {/* Date Filter */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Dari:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Sampai:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
              />
            </div>
            {(dateFrom || dateTo) && (
              <button
                onClick={() => { setDateFrom(""); setDateTo(""); }}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
              >
                Reset
              </button>
            )}
            <span className="text-sm text-gray-500 ml-auto">
              {filteredTrans.length} transaksi
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-left">
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Tipe</th>
                <th className="px-4 py-3">Pembayaran</th>
                <th className="px-4 py-3">Meja</th>
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrans.map((t) => (
                <tr key={t.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-amber-400 font-mono">{t.kode_transaksi}</td>
                  <td className="px-4 py-3 text-white">{t.tipe}</td>
                  <td className="px-4 py-3">
                    {t.payment_method ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        t.payment_method === "cash" ? "bg-green-900/30 text-green-400" : "bg-blue-900/30 text-blue-400"
                      }`}>
                        {t.payment_method.toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{t.meja?.nomor_meja || "—"}</td>
                  <td className="px-4 py-3 text-gray-300">{t.nama_pelanggan || "—"}</td>
                  <td className="px-4 py-3 text-right text-white">
                    {t.total_bayar ? `Rp ${parseInt(t.total_bayar).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(t.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
              {filteredTrans.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
