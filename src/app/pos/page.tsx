'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getMejas, getProducts, createTransaksi, addItem,
  bayarTransaksi, getTransaksis, cafePos,
  Meja, Product, Transaksi,
} from "@/lib/api";
import MejaGrid from "@/components/MejaGrid";
import ProductList from "@/components/ProductList";

type TabMode = "billiard" | "cafe";

export default function POSPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<TabMode>("billiard");

  // Billiard state
  const [meja, setMeja] = useState<Meja[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [selectedMeja, setSelectedMeja] = useState<Meja | null>(null);
  const [loading, setLoading] = useState(true);
  const [pelanggan, setPelanggan] = useState("");
  const [cart, setCart] = useState<Map<number, { product: Product; qty: number }>>(new Map());
  const [activeTransaksi, setActiveTransaksi] = useState<Transaksi | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cafe state
  const [cafePaymentMethod, setCafePaymentMethod] = useState<"cash" | "qris">("cash");
  const [cafeQuantities, setCafeQuantities] = useState<Map<number, number>>(new Map());
  const [cafeSubmitting, setCafeSubmitting] = useState(false);

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

  // ========== Billiard handlers ==========

  const handleSelectMeja = (m: Meja) => {
    setSelectedMeja(m);
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
    setSuccess("");
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
    setSuccess("");
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
    setSuccess("");
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
    setSuccess("");
    try {
      await bayarTransaksi(activeTransaksi.id);
      setSuccess(`Transaksi ${activeTransaksi.kode_transaksi} berhasil dibayar!`);
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

  // ========== Cafe handlers ==========

  const handleCafeQtyChange = (productId: number, qty: number) => {
    const newQ = new Map(cafeQuantities);
    if (qty <= 0) {
      newQ.delete(productId);
    } else {
      newQ.set(productId, qty);
    }
    setCafeQuantities(newQ);
  };

  const handleCafeCheckout = async () => {
    setError("");
    setSuccess("");

    // Validate at least 1 item selected
    const items: Record<string, number> = {};
    let hasItems = false;
    for (const [productId, qty] of cafeQuantities) {
      if (qty > 0) {
        items[String(productId)] = qty;
        hasItems = true;
      }
    }

    if (!hasItems) {
      setError("Pilih minimal 1 produk");
      return;
    }

    setCafeSubmitting(true);
    try {
      const result = await cafePos(cafePaymentMethod, items);
      setSuccess("Transaksi cafe berhasil! 🧾");
      setCafeQuantities(new Map());
      // Redirect to receipt page
      router.push(`/receipt/${result.id}`);
    } catch (err: any) {
      setError(err.message);
    }
    setCafeSubmitting(false);
  };

  const cafeSubtotal = Array.from(cafeQuantities.entries()).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === id);
    return sum + (product ? parseInt(product.price) * qty : 0);
  }, 0);

  const cafeTotalItems = Array.from(cafeQuantities.values()).reduce((sum, q) => sum + q, 0);

  if (authLoading || loading) {
    return <div className="text-center py-20 text-6xl animate-pulse">🎱</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">POS / Kasir</h1>

      {/* Success Notification */}
      {success && (
        <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-2 rounded-lg text-sm flex items-center justify-between">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess("")} className="text-green-400 hover:text-green-200 ml-2">✕</button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-200 ml-2">✕</button>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1">
        <button
          onClick={() => { setTab("billiard"); setError(""); setSuccess(""); }}
          className={`billiard-tab ${tab === "billiard" ? "active" : "inactive"}`}
        >
          🎱 Billiard
        </button>
        <button
          onClick={() => { setTab("cafe"); setError(""); setSuccess(""); }}
          className={`billiard-tab ${tab === "cafe" ? "active" : "inactive"}`}
        >
          ☕ Cafe
        </button>
      </div>

      {/* ==================== BILLIARD TAB ==================== */}
      {tab === "billiard" && (
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
                    <ProductList
                      products={products}
                      onAdd={handleAddProduct}
                      selected={new Map(
                        Array.from(cart.entries()).map(([id, item]) => [id, item.qty])
                      )}
                    />
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
      )}

      {/* ==================== CAFE TAB ==================== */}
      {tab === "cafe" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Product Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="billiard-card p-4">
              <h2 className="text-lg font-semibold text-white mb-3">Pilih Produk Cafe</h2>
              <ProductList
                products={products.filter((p) => p.product_type !== "billiard")}
                cafeMode
                quantities={cafeQuantities}
                onQtyChange={handleCafeQtyChange}
              />
            </div>
          </div>

          {/* Right: Checkout Sidebar */}
          <div className="space-y-4">
            <div className="billiard-card p-4 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">
                ☕ Checkout Cafe
              </h2>

              {/* Payment Method */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Metode Pembayaran</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCafePaymentMethod("cash")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      cafePaymentMethod === "cash"
                        ? "bg-green-700 text-white border border-green-500"
                        : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    💵 Cash
                  </button>
                  <button
                    onClick={() => setCafePaymentMethod("qris")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      cafePaymentMethod === "qris"
                        ? "bg-blue-700 text-white border border-blue-500"
                        : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    📱 QRIS
                  </button>
                </div>
              </div>

              {/* Selected Items */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto mb-4">
                {Array.from(cafeQuantities.entries()).map(([productId, qty]) => {
                  if (qty <= 0) return null;
                  const product = products.find((p) => p.id === productId);
                  if (!product) return null;
                  return (
                    <div key={productId} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">
                          Rp {parseInt(product.price).toLocaleString()} × {qty}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => handleCafeQtyChange(productId, qty - 1)}
                          className="w-6 h-6 rounded bg-gray-700 text-white text-xs hover:bg-gray-600"
                        >-</button>
                        <span className="text-sm text-white w-6 text-center">{qty}</span>
                        <button
                          onClick={() => handleCafeQtyChange(productId, Math.min(qty + 1, product.stock))}
                          className="w-6 h-6 rounded bg-gray-700 text-white text-xs hover:bg-gray-600"
                          disabled={qty >= product.stock}
                        >+</button>
                      </div>
                    </div>
                  );
                })}
                {cafeTotalItems === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">Belum ada produk dipilih</p>
                )}
              </div>

              {/* Total & Checkout */}
              <div className="border-t border-gray-700 pt-3 space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Jumlah Item</span>
                  <span className="text-white">{cafeTotalItems}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span className="text-amber-400">Rp {cafeSubtotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCafeCheckout}
                  disabled={cafeTotalItems === 0 || cafeSubmitting}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors"
                >
                  {cafeSubmitting ? "Memproses..." : "🧾 Bayar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
