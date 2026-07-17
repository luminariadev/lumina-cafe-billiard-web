'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getMejas, getProducts, createTransaksi, addItem,
  bayarTransaksi, getTransaksis,
  Meja, Product, Transaksi,
} from "@/lib/api";
import MejaGrid from "@/components/MejaGrid";
import ProductList from "@/components/ProductList";

export default function POSPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [meja, setMeja] = useState<Meja[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [selectedMeja, setSelectedMeja] = useState<Meja | null>(null);
  const [loading, setLoading] = useState(true);
  const [pelanggan, setPelanggan] = useState("");
  const [cart, setCart] = useState<Map<number, { product: Product; qty: number }>>(new Map());
  const [activeTransaksi, setActiveTransaksi] = useState<Transaksi | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    refreshData();
  }, [user]);

  const refreshData = async () => {
    try {
      const [m, p, t] = await Promise.all([
        getMejas(), getProducts(), getTransaksis(),
      ]);
      setMeja(m);
      setProducts(p);
      setTransaksis(t);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSelectMeja = (m: Meja) => {
    setSelectedMeja(m);
    // Check if there's an active transaksi for this meja
    const existing = transaksis.find(
      (t) => t.meja_id === m.id && t.status === "aktif"
    );
    if (existing) {
      setActiveTransaksi(existing);
    } else {
      setActiveTransaksi(null);
      setCart(new Map());
    }
    setError("");
  };

  const handleAddProduct = (product: Product) => {
    const newCart = new Map(cart);
    if (newCart.has(product.id)) {
      newCart.set(product.id, { product, qty: newCart.get(product.id)!.qty + 1 });
    } else {
      newCart.set(product.id, { product, qty: 1 });
    }
    setCart(newCart);
  };

  const updateQty = (productId: number, qty: number) => {
    const newCart = new Map(cart);
    if (qty <= 0) {
      newCart.delete(productId);
    } else {
      const existing = newCart.get(productId);
      if (existing) newCart.set(productId, { ...existing, qty });
    }
    setCart(newCart);
  };

  const handleStartTransaksi = async () => {
    if (!selectedMeja) return;
    setError("");
    try {
      const t = await createTransaksi({
        meja_id: selectedMeja.id,
        tipe: "billiard",
        nama_pelanggan: pelanggan || undefined,
      });
      setActiveTransaksi(t);
      setCart(new Map());
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddItems = async () => {
    if (!activeTransaksi || cart.size === 0) return;
    setError("");
    try {
      for (const [, item] of cart) {
        await addItem(activeTransaksi.id, {
          product_id: item.product.id,
          qty: item.qty,
        });
      }
      setCart(new Map());
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBayar = async () => {
    if (!activeTransaksi) return;
    setError("");
    try {
      await bayarTransaksi(activeTransaksi.id);
      setActiveTransaksi(null);
      setSelectedMeja(null);
      setCart(new Map());
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const totalCart = Array.from(cart.values()).reduce(
    (sum, item) => sum + parseInt(item.product.price) * item.qty,
    0
  );

  if (authLoading || loading) {
    return <div className="text-center py-20 text-6xl animate-pulse">🎱</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">POS / Kasir</h1>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Meja Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#111d15] border border-[#2d5a27] rounded-xl p-4">
            <h2 className="text-lg font-semibold text-white mb-3">Pilih Meja</h2>
            <MejaGrid meja={meja} onSelect={handleSelectMeja} selectedId={selectedMeja?.id} />
          </div>

          {selectedMeja && (
            <div className="bg-[#111d15] border border-[#2d5a27] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">
                  Meja {selectedMeja.nomor_meja} — {selectedMeja.keterangan}
                </h2>
                <span className="text-sm text-gray-400">{selectedMeja.status}</span>
              </div>

              {activeTransaksi ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Nama Pelanggan"
                      value={pelanggan}
                      onChange={(e) => setPelanggan(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                    />
                  </div>
                  <p className="text-sm text-amber-400 font-mono">
                    Transaksi: {activeTransaksi.kode_transaksi}
                  </p>
                  <ProductList products={products} onAdd={handleAddProduct} selected={new Map(
                    Array.from(cart.entries()).map(([id, item]) => [id, item.qty])
                  )} />
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nama Pelanggan (opsional)"
                    value={pelanggan}
                    onChange={(e) => setPelanggan(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500"
                  />
                  <button
                    onClick={handleStartTransaksi}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-colors"
                  >
                    Mulai Transaksi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Cart & Payment */}
        <div className="space-y-4">
          <div className="bg-[#111d15] border border-[#2d5a27] rounded-xl p-4 sticky top-24">
            <h2 className="text-lg font-semibold text-white mb-3">
              🛒 Keranjang
              {cart.size > 0 && (
                <span className="ml-2 text-sm text-gray-400">{cart.size} item</span>
              )}
            </h2>

            <div className="space-y-2 max-h-[300px] overflow-y-auto mb-4">
              {Array.from(cart.values()).map((item) => (
                <div key={item.product.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                  <div className="flex-1">
                    <p className="text-sm text-white">{item.product.name}</p>
                    <p className="text-xs text-gray-400">
                      Rp {parseInt(item.product.price).toLocaleString()} × {item.qty}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.product.id, item.qty - 1)}
                      className="w-6 h-6 rounded bg-gray-700 text-white text-xs hover:bg-gray-600"
                    >-</button>
                    <span className="text-sm text-white w-6 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.product.id, item.qty + 1)}
                      className="w-6 h-6 rounded bg-gray-700 text-white text-xs hover:bg-gray-600"
                    >+</button>
                  </div>
                </div>
              ))}
              {cart.size === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">Keranjang kosong</p>
              )}
            </div>

            <div className="border-t border-gray-700 pt-3 space-y-2">
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span className="text-amber-400">Rp {totalCart.toLocaleString()}</span>
              </div>

              {activeTransaksi && (
                <>
                  <button
                    onClick={handleAddItems}
                    disabled={cart.size === 0}
                    className="w-full py-2.5 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl transition-colors text-sm font-semibold"
                  >
                    Tambahkan ke Transaksi
                  </button>
                  <button
                    onClick={handleBayar}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-colors font-semibold"
                  >
                    Bayar & Selesai
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
