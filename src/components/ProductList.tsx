'use client';
import { Product } from "@/lib/api";
import { useState } from "react";

interface Props {
  products: Product[];
  onAdd?: (product: Product) => void;
  selected?: Map<number, number>;
}

export default function ProductList({ products, onAdd, selected }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filter === "all" || p.product_type === filter;
    return matchSearch && matchType;
  });

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
        >
          <option value="all">Semua</option>
          <option value="minuman">Minuman</option>
          <option value="makanan">Makanan</option>
          <option value="snack">Snack</option>
          <option value="billiard">Billiard</option>
        </select>
      </div>
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => onAdd?.(p)}
            className="flex items-center justify-between px-3 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors"
          >
            <div>
              <div className="text-sm text-white font-medium">{p.name}</div>
              <div className="text-xs text-gray-400">Rp {parseInt(p.price).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              {selected?.has(p.id) && (
                <span className="px-2 py-0.5 bg-amber-600 text-white text-xs rounded-full">
                  {selected.get(p.id)}
                </span>
              )}
              <span className="text-lg text-amber-400">+</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">Produk tidak ditemukan</p>
        )}
      </div>
    </div>
  );
}
