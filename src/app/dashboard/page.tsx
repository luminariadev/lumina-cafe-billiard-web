'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMejas, getTransaksis, getProducts, Meja, Transaksi, Product } from "@/lib/api";
import MejaGrid from "@/components/MejaGrid";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [meja, setMeja] = useState<Meja[]>([]);
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getMejas().catch(() => []),
      getTransaksis().catch(() => []),
      getProducts().catch(() => []),
    ]).then(([m, t, p]) => {
      setMeja(m);
      setTransaksis(t);
      setProducts(p);
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111d15] border border-[#2d5a27] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Meja Tersedia</p>
              <p className="text-3xl font-bold text-green-400">{tersediaMeja.length}</p>
            </div>
            <span className="text-4xl">🎱</span>
          </div>
        </div>
        <div className="bg-[#111d15] border border-[#2d5a27] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Transaksi Aktif</p>
              <p className="text-3xl font-bold text-amber-400">{aktifTransaksi.length}</p>
            </div>
            <span className="text-4xl">📋</span>
          </div>
        </div>
        <div className="bg-[#111d15] border border-[#2d5a27] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Produk</p>
              <p className="text-3xl font-bold text-blue-400">{totalProduk}</p>
            </div>
            <span className="text-4xl">🍽️</span>
          </div>
        </div>
      </div>

      {/* Transaksi Aktif */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Transaksi Aktif</h2>
        <div className="grid gap-3">
          {aktifTransaksi.slice(0, 5).map((t) => (
            <div key={t.id} className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-amber-400 font-mono text-sm">{t.kode_transaksi}</span>
                {t.meja && <span className="ml-3 text-gray-400 text-sm">Meja {t.meja.nomor_meja}</span>}
                <span className="ml-2 text-xs px-2 py-0.5 bg-amber-900/40 text-amber-300 rounded">{t.tipe}</span>
              </div>
              <span className="text-green-400 text-sm">{t.status}</span>
            </div>
          ))}
          {aktifTransaksi.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">Tidak ada transaksi aktif</p>
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
