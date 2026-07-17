'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getTransaksis, bayarTransaksi, Transaksi } from "@/lib/api";
import TransaksiCard from "@/components/TransaksiCard";

export default function TransaksisPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  const handleBayar = async (id: number) => {
    try {
      await bayarTransaksi(id);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = filter === "all" ? transaksis : transaksis.filter((t) => t.status === filter);

  if (authLoading || loading) return <div className="text-center py-20 text-6xl animate-pulse">🎱</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Transaksi</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
        >
          <option value="all">Semua</option>
          <option value="aktif">Aktif</option>
          <option value="selesai">Selesai</option>
          <option value="dibayar">Dibayar</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-gray-500 text-center py-8">Tidak ada transaksi</p>
        )}
        {filtered.map((t) => (
          <TransaksiCard key={t.id} transaksi={t} onBayar={handleBayar} />
        ))}
      </div>
    </div>
  );
}
