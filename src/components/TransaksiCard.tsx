'use client';
import { Transaksi } from "@/lib/api";

interface Props {
  transaksi: Transaksi;
  onBayar?: (id: number) => void;
}

export default function TransaksiCard({ transaksi, onBayar }: Props) {
  const statusColor: Record<string, string> = {
    aktif: "text-green-400 bg-green-900/30",
    selesai: "text-blue-400 bg-blue-900/30",
    dibayar: "text-gray-400 bg-gray-800/50",
  };

  const total = transaksi.transaksi_items?.reduce(
    (sum, item) => sum + parseInt(item.subtotal),
    0
  ) || 0;

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-amber-400 font-mono text-sm">{transaksi.kode_transaksi}</span>
          <span className={`ml-2 px-2 py-0.5 rounded text-xs ${statusColor[transaksi.status] || ""}`}>
            {transaksi.status}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(transaksi.created_at).toLocaleString("id-ID")}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-300">
        {transaksi.meja && <span>Meja {transaksi.meja.nomor_meja}</span>}
        <span>{transaksi.tipe}</span>
        {transaksi.nama_pelanggan && <span>👤 {transaksi.nama_pelanggan}</span>}
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
        <span className="font-bold text-white">
          Rp {total.toLocaleString()}
          {transaksi.total_bayar && (
            <span className="text-gray-400 text-sm ml-2">
              | Bayar: Rp {parseInt(transaksi.total_bayar).toLocaleString()}
            </span>
          )}
        </span>
        {transaksi.status === "aktif" && onBayar && (
          <button
            onClick={() => onBayar(transaksi.id)}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm rounded-lg transition-colors"
          >
            Bayar
          </button>
        )}
      </div>
    </div>
  );
}
