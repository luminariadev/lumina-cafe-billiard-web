'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getTransaksis, Transaksi } from "@/lib/api";

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && user?.role !== "admin") router.push("/dashboard");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setTransaksis(await getTransaksis());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const dibayar = transaksis.filter((t) => t.status === "dibayar");
  const totalOmset = dibayar.reduce((sum, t) => sum + parseInt(t.total_bayar || "0"), 0);
  const billiardCount = dibayar.filter((t) => t.tipe === "billiard").length;
  const cafeCount = dibayar.filter((t) => t.tipe === "cafe").length;

  if (authLoading || loading) return <div className="text-center py-20 text-6xl animate-pulse">🎱</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Laporan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111d15] border border-[#2d5a27] rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total Pendapatan</p>
          <p className="text-3xl font-bold text-amber-400">Rp {totalOmset.toLocaleString()}</p>
        </div>
        <div className="bg-[#111d15] border border-[#2d5a27] rounded-xl p-5">
          <p className="text-gray-400 text-sm">Transaksi Billiard</p>
          <p className="text-3xl font-bold text-green-400">{billiardCount}</p>
        </div>
        <div className="bg-[#111d15] border border-[#2d5a27] rounded-xl p-5">
          <p className="text-gray-400 text-sm">Transaksi Cafe</p>
          <p className="text-3xl font-bold text-blue-400">{cafeCount}</p>
        </div>
      </div>

      <div className="bg-[#111d15] border border-[#2d5a27] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Riwayat Transaksi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-left">
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Tipe</th>
                <th className="px-4 py-3">Meja</th>
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {transaksis.map((t) => (
                <tr key={t.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-amber-400 font-mono">{t.kode_transaksi}</td>
                  <td className="px-4 py-3 text-white">{t.tipe}</td>
                  <td className="px-4 py-3 text-gray-300">{t.meja?.nomor_meja || "—"}</td>
                  <td className="px-4 py-3 text-gray-300">{t.nama_pelanggan || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      t.status === "aktif" ? "bg-green-900/30 text-green-400" :
                      t.status === "selesai" ? "bg-blue-900/30 text-blue-400" :
                      "bg-gray-800/50 text-gray-400"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-white">
                    {t.total_bayar ? `Rp ${parseInt(t.total_bayar).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(t.created_at).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
