'use client';
import { Product } from "@/lib/api";
import { useState } from "react";

interface Props {
  products: Product[];
  onAdd?: (product: Product) => void;
  selected?: Map<number, number>;
  /** Cafe POS mode — show cards with image placeholders, stock badge, qty stepper */
  cafeMode?: boolean;
  /** For cafe mode: quantity map for each product */
  quantities?: Map<number, number>;
  onQtyChange?: (productId: number, qty: number) => void;
}

// Emoji map by product type / name
function productEmoji(name: string, type: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("kopi") || lower.includes("coffee") || lower.includes("espresso") || lower.includes("kapal")) return "☕";
  if (lower.includes("teh") || lower.includes("tea")) return "🍵";
  if (lower.includes("jus") || lower.includes("juice")) return "🧃";
  if (lower.includes("soda") || lower.includes("cola") || lower.includes("sprite") || lower.includes("fanta")) return "🥤";
  if (lower.includes("mie") || lower.includes("noodle") || lower.includes("indomie")) return "🍜";
  if (lower.includes("nasi") || lower.includes("rice")) return "🍚";
  if (lower.includes("ayam") || lower.includes("chicken")) return "🍗";
  if (lower.includes("burger") || lower.includes("sandwich")) return "🍔";
  if (lower.includes("pizza")) return "🍕";
  if (lower.includes("snack") || lower.includes("kentang") || lower.includes("fries") || lower.includes("potato")) return "🍟";
  if (lower.includes("roti") || lower.includes("bread") || lower.includes("toast")) return "🍞";
  if (lower.includes("cake") || lower.includes("kue")) return "🎂";
  if (lower.includes("donat") || lower.includes("donut")) return "🍩";
  if (lower.includes("ice") || lower.includes("es") || lower.includes("eskrim")) return "🍦";
  if (lower.includes("air") || lower.includes("water")) return "💧";
  if (lower.includes("bir") || lower.includes("beer")) return "🍺";
  if (type === "billiard") return "🎱";
  if (type === "snack") return "🍿";
  return "🍽️";
}

export default function ProductList({ products, onAdd, selected, cafeMode, quantities, onQtyChange }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filter === "all" || p.product_type === filter;
    return matchSearch && matchType;
  });

  const isLowStock = (stock: number) => stock > 0 && stock <= 5;
  const isOutOfStock = (stock: number) => stock <= 0;
  const getQty = (productId: number) => quantities?.get(productId) || 0;

  // Cafe POS card mode
  if (cafeMode) {
    return (
      <div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/50"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/50"
          >
            <option value="all">Semua</option>
            <option value="minuman">Minuman</option>
            <option value="makanan">Makanan</option>
            <option value="snack">Snack</option>
            <option value="billiard">Billiard</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((p) => {
            const qty = getQty(p.id);
            const low = isLowStock(p.stock);
            const out = isOutOfStock(p.stock);

            return (
              <div
                key={p.id}
                className={`cafe-product-card ${low ? "low-stock" : ""} ${out ? "opacity-50" : ""}`}
              >
                {/* Emoji placeholder */}
                <div className="text-4xl mb-2">{productEmoji(p.name, p.product_type)}</div>

                {/* Name & Price */}
                <h3 className="text-sm font-semibold text-white leading-tight mb-1">{p.name}</h3>
                <p className="text-[#c9a84c] font-bold text-sm mb-2">
                  Rp {parseInt(p.price).toLocaleString()}
                </p>

                {/* Stock Badge */}
                {out ? (
                  <span className="stock-badge out">Habis</span>
                ) : low ? (
                  <span className="stock-badge low">Sisa {p.stock}</span>
                ) : (
                  <span className="stock-badge ok">Stok {p.stock}</span>
                )}

                {/* Quantity Stepper — only when stock > 0 */}
                {!out && onQtyChange && (
                  <div className="mt-3 qty-stepper">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQtyChange(p.id, Math.max(0, qty - 1));
                      }}
                      disabled={qty <= 0}
                      className="opacity-80 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={p.stock}
                      value={qty}
                      onChange={(e) => {
                        const v = parseInt(e.target.value) || 0;
                        onQtyChange(p.id, Math.min(v, p.stock));
                      }}
                      className="w-12 text-center bg-gray-800 border border-gray-700 rounded-lg text-sm text-white py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQtyChange(p.id, Math.min(qty + 1, p.stock));
                      }}
                      disabled={qty >= p.stock}
                      className="opacity-80 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Subtotal per item */}
                {qty > 0 && (
                  <p className="mt-2 text-xs text-amber-300 font-semibold">
                    Rp {(parseInt(p.price) * qty).toLocaleString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">Produk tidak ditemukan</p>
        )}
      </div>
    );
  }

  // Default billiard mode (list view)
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
