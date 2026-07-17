'use client';
import { Meja } from "@/lib/api";

interface Props {
  meja: Meja[];
  onSelect?: (m: Meja) => void;
  selectedId?: number | null;
}

const statusColors: Record<string, string> = {
  tersedia: "border-green-500/50 bg-green-950/30 text-green-400",
  dipakai: "border-red-500/50 bg-red-950/30 text-red-400",
  maintenance: "border-yellow-500/50 bg-yellow-950/30 text-yellow-400",
};

const statusLabels: Record<string, string> = {
  tersedia: "Tersedia",
  dipakai: "Dipakai",
  maintenance: "Perbaikan",
};

export default function MejaGrid({ meja, onSelect, selectedId }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {meja.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect?.(m)}
          disabled={m.status === "dipakai"}
          className={`relative p-4 rounded-xl border-2 transition-all text-center
            ${statusColors[m.status] || "border-gray-700 bg-gray-900 text-gray-400"}
            ${selectedId === m.id ? "ring-2 ring-amber-400 scale-105" : ""}
            ${onSelect && m.status !== "dipakai" ? "cursor-pointer hover:scale-105" : "cursor-default"}
            ${m.status === "maintenance" ? "opacity-60" : ""}
          `}
        >
          <div className="text-3xl mb-1">🎱</div>
          <div className="font-bold text-sm">Meja {m.nomor_meja}</div>
          <div className="text-[10px] mt-1 opacity-80">{statusLabels[m.status]}</div>
        </button>
      ))}
    </div>
  );
}
