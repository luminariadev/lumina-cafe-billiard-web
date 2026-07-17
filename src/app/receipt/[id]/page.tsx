'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getTransaksis, Transaksi } from "@/lib/api";

export default function ReceiptPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const all = await getTransaksis();
      const found = all.find((t) => t.id === parseInt(id));
      if (found) {
        setTransaksi(found);
      } else {
        setError("Transaksi tidak ditemukan");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !id) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  const handlePrint = () => {
    window.print();
  };

  if (authLoading || loading) {
    return <div className="text-center py-20 text-6xl animate-pulse">🧾</div>;
  }

  if (error || !transaksi) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4">{error || "Transaksi tidak ditemukan"}</p>
        <button
          onClick={() => router.push("/pos")}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg"
        >
          Kembali ke POS
        </button>
      </div>
    );
  }

  const items = transaksi.transaksi_items || [];
  const subtotal = items.reduce((sum, item) => sum + parseInt(item.subtotal), 0);
  const grandTotal = transaksi.total_bayar ? parseInt(transaksi.total_bayar) : subtotal;

  return (
    <div className="max-w-md mx-auto">
      {/* Receipt Card */}
      <div
        id="receipt"
        className="bg-white text-black rounded-xl p-6 shadow-2xl print:shadow-none print:rounded-none"
      >
        {/* Header */}
        <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
          <h1 className="text-2xl font-bold tracking-wide">🧾 LUMINA CAFE</h1>
          <p className="text-sm text-gray-600 mt-1">Billiard & Cafe</p>
          {transaksi.payment_method && (
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                transaksi.payment_method === "cash"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {transaksi.payment_method === "cash" ? "💵 CASH" : "📱 QRIS"}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="text-sm text-gray-700 space-y-1 mb-4">
          <div className="flex justify-between">
            <span>No. Transaksi</span>
            <span className="font-mono font-medium">{transaksi.kode_transaksi}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal</span>
            <span>
              {transaksi.transaction_date
                ? new Date(transaksi.transaction_date).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : new Date(transaksi.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Kasir</span>
            <span>{transaksi.user?.name || "—"}</span>
          </div>
          {transaksi.nama_pelanggan && (
            <div className="flex justify-between">
              <span>Pelanggan</span>
              <span>{transaksi.nama_pelanggan}</span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide grid grid-cols-12 gap-2 pb-2 border-b border-gray-200 mb-2">
            <span className="col-span-5">Item</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-3 text-right">Harga</span>
            <span className="col-span-2 text-right">Subtotal</span>
          </div>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 text-sm"
              >
                <span className="col-span-5 truncate">{item.product?.name || `Produk #${item.product_id}`}</span>
                <span className="col-span-2 text-center">{item.qty}</span>
                <span className="col-span-3 text-right">
                  Rp {parseInt(item.harga_satuan).toLocaleString()}
                </span>
                <span className="col-span-2 text-right font-medium">
                  Rp {parseInt(item.subtotal).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-6">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString()}</span>
          </div>
          {grandTotal !== subtotal && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Bayar</span>
              <span>Rp {grandTotal.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>Rp {grandTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 border-t-2 border-dashed border-gray-300 pt-4">
          <p>Terima kasih telah berbelanja di Lumina Cafe</p>
          <p className="mt-1">~ Selamat menikmati ~</p>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-6 flex gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-colors"
        >
          🖨️ Cetak Struk
        </button>
        <button
          onClick={() => router.push("/pos")}
          className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
        >
          Kembali ke POS
        </button>
      </div>
    </div>
  );
}
