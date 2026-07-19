'use client';

import { useState, useEffect } from 'react';
import { getProducts, getMejas, Product, Meja, cafePos } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
}

export default function PosPage() {
  const { user } = useAuth();
  const role = user?.role ?? 'admin';
  // Kasir billiard → tab billiard, kasir cafe → tab cafe, admin → default cafe
  const [tab, setTab] = useState<'billiard' | 'cafe'>(
    role === 'kasir_billiard' ? 'billiard' : 'cafe'
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [mejas, setMejas] = useState<Meja[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getMejas()])
      .then(([p, m]) => { setProducts(p || []); setMejas(m || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) return prev.map(i => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId: product.id, name: product.name, price: parseFloat(product.price), qty: 1 }];
    });
  };

  const updateQty = (productId: number, delta: number) => {
    setCart(prev => {
      const item = prev.find(i => i.productId === productId);
      if (!item) return prev;
      const newQty = item.qty + delta;
      if (newQty <= 0) return prev.filter(i => i.productId !== productId);
      return prev.map(i => i.productId === productId ? { ...i, qty: newQty } : i);
    });
  };

  const removeFromCart = (productId: number) => setCart(prev => prev.filter(i => i.productId !== productId));
  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    setMessage(null);
    try {
      const items: Record<string, number> = {};
      cart.forEach(item => { items[String(item.productId)] = item.qty; });
      const result = await cafePos(paymentMethod, items);
      setMessage(`✅ Transaksi berhasil! Kode: ${result.kode_transaksi}`);
      clearCart();
    } catch (err: any) {
      setMessage(`❌ Gagal: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><span className="material-symbols-outlined text-green-400 text-5xl animate-pulse">point_of_sale</span></div>;

  return (
    <div className="space-y-6">
      {/* Tabs — hanya tampil jika role punya akses keduanya */}
      {role !== 'kasir_billiard' && role !== 'kasir_cafe' && (
        <div className="flex gap-4 mb-6">
          <button onClick={() => setTab('billiard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
              tab === 'billiard' ? 'bg-green-400 text-black' : 'bg-gray-800 text-gray-400 hover:text-green-400'}`}>
            <span className="material-symbols-outlined text-lg">sports_bar</span> Billiards
          </button>
          <button onClick={() => setTab('cafe')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
              tab === 'cafe' ? 'bg-green-400 text-black' : 'bg-gray-800 text-gray-400 hover:text-green-400'}`}>
            <span className="material-symbols-outlined text-lg">local_cafe</span> Cafe
          </button>
        </div>
      )}

      {tab === 'billiard' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-6">
            <h4 className="text-lg font-semibold font-[Montserrat] text-gray-200 mb-4">Active Sessions</h4>
            {mejas.filter(m => m.status === 'dipakai').length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No active sessions</p>
            ) : (
              <div className="space-y-4">
                {mejas.filter(m => m.status === 'dipakai').map(m => (
                  <div key={m.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-900 border border-green-400/20">
                    <div>
                      <p className="text-sm font-medium text-green-400">Table {String(m.nomor_meja).padStart(2, '0')}</p>
                      <p className="text-xs text-gray-400">{m.keterangan || 'In use'}</p>
                    </div>
                    <span className="material-symbols-outlined text-green-400">timer</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="glass-card rounded-xl p-6">
            <h4 className="text-lg font-semibold font-[Montserrat] text-gray-200 mb-4">Available Tables</h4>
            <div className="grid grid-cols-2 gap-4">
              {mejas.filter(m => m.status === 'tersedia').map(m => (
                <div key={m.id} className="p-4 rounded-lg bg-gray-900 border border-gray-800 text-center hover:border-green-400/40 transition-all cursor-pointer">
                  <p className="text-sm font-medium text-green-400">Table {String(m.nomor_meja).padStart(2, '0')}</p>
                  <p className="text-xs text-gray-400 capitalize">{m.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Product Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <button key={product.id} onClick={() => addToCart(product)}
                className="group bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-green-400/40 transition-all duration-300 text-left hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className="aspect-[16/10] bg-gray-800 flex items-center justify-center relative">
                  <span className="material-symbols-outlined text-5xl text-gray-600 group-hover:scale-110 transition-transform">
                    {product.product_type === 'makanan' ? 'restaurant' : 'local_cafe'}
                  </span>
                  <div className="absolute top-3 right-3 px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-green-400 font-bold text-sm">
                    Rp {parseInt(product.price).toLocaleString('id-ID')}
                  </div>
                  {product.stock <= 5 && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-500/90 text-white text-[10px] font-bold rounded-full">
                      {product.stock} left
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-semibold font-[Montserrat] text-gray-200">{product.name}</h3>
                  <p className="text-xs text-gray-400">{product.product_type || 'Product'}</p>
                  <div className="flex items-center justify-between text-green-400 pt-2">
                    <span className="text-sm font-medium">Add to Order</span>
                    <span className="material-symbols-outlined">add_circle</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Cart Sidebar */}
          <aside className="w-full lg:w-[400px] flex flex-col bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-2xl h-fit lg:sticky lg:top-24 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold font-[Montserrat] text-gray-200">Current Order</h2>
              <button onClick={clearCart} className="text-sm font-medium uppercase tracking-wider text-gray-400 hover:text-red-400 transition-colors">Clear</button>
            </div>

            {/* Payment Method */}
            <div className="bg-black rounded-xl p-4 border border-gray-800">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Payment Method</p>
              <div className="flex gap-2">
                <button onClick={() => setPaymentMethod('cash')}
                  className={`flex-1 py-2 border rounded-lg font-bold text-sm transition-all ${paymentMethod === 'cash' ? 'border-green-400 bg-green-400/10 text-green-400' : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-green-400/40'}`}>Cash</button>
                <button onClick={() => setPaymentMethod('qris')}
                  className={`flex-1 py-2 border rounded-lg font-bold text-sm transition-all ${paymentMethod === 'qris' ? 'border-green-400 bg-green-400/10 text-green-400' : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-green-400/40'}`}>QRIS</button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4 max-h-80 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-600 py-10">
                  <span className="material-symbols-outlined text-5xl mb-3">shopping_cart_checkout</span>
                  <p className="text-sm">Order is empty</p>
                  <p className="text-xs text-gray-500">Select items to add</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.productId} className="flex items-center justify-between p-4 bg-black rounded-xl border border-gray-800 group hover:border-green-400/20 transition-colors">
                    <div className="flex-1 min-w-0 mr-4">
                      <h4 className="text-sm font-medium text-gray-200 truncate">{item.name}</h4>
                      <p className="text-green-400 font-bold">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-gray-800 rounded-lg p-0.5 border border-gray-700">
                        <button onClick={() => updateQty(item.productId, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-400 transition-colors">-</button>
                        <span className="w-6 text-center font-bold text-gray-200">{item.qty}</span>
                        <button onClick={() => updateQty(item.productId, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-400 transition-colors">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.productId)} className="material-symbols-outlined text-gray-500 hover:text-red-400 transition-colors">delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary */}
            <div className="space-y-3 pt-6 border-t border-gray-800">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span className="font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>PPN (12%)</span>
                <span className="font-bold">Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-end mt-1">
                <span className="text-xl font-semibold text-gray-200">Total</span>
                <span className="text-2xl font-bold text-green-400">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {message && (
              <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
                message.includes('✅') ? 'bg-green-400/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {message}
              </div>
            )}

            <button onClick={handleCheckout} disabled={cart.length === 0 || processing}
              className="w-full py-4 bg-green-400 text-black font-bold rounded-xl active:scale-95 transition-all shadow-[0_0_20px_rgba(107,251,154,0.15)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin">sync</span> Processing...
                </span>
              ) : (
                `Process Payment - Rp ${total.toLocaleString('id-ID')}`
              )}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
