'use client';

import { useState, useEffect } from 'react';
import { getProducts, getMejas, Product, Meja, cafePos } from '@/lib/api';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
}

export default function PosPage() {
  const [tab, setTab] = useState<'billiard' | 'cafe'>('cafe');
  const [products, setProducts] = useState<Product[]>([]);
  const [mejas, setMejas] = useState<Meja[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getMejas()])
      .then(([p, m]) => {
        setProducts(p || []);
        setMejas(m || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
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

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

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
      cart.forEach(item => { items[item.productId] = item.qty; });
      const result = await cafePos(paymentMethod, items);
      setMessage(`✅ Transaksi berhasil! Kode: ${result.kode_transaksi}`);
      clearCart();
    } catch (err: any) {
      setMessage(`❌ Gagal: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex justify-center"><span className="material-symbols-outlined text-primary text-6xl animate-pulse">sports_bar</span></div>;

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-sm mb-lg">
        <button
          onClick={() => setTab('billiard')}
          className={`flex items-center gap-2 px-lg py-md rounded-xl font-label-md transition-all ${
            tab === 'billiard' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-sm">sports_bar</span> Billiards
        </button>
        <button
          onClick={() => setTab('cafe')}
          className={`flex items-center gap-2 px-lg py-md rounded-xl font-label-md transition-all ${
            tab === 'cafe' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-sm">local_cafe</span> Cafe
        </button>
      </div>

      {tab === 'billiard' ? (
        <BilliardView mejas={mejas} />
      ) : (
        <CafeView
          products={products}
          cart={cart}
          addToCart={addToCart}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          subtotal={subtotal}
          tax={tax}
          total={total}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          handleCheckout={handleCheckout}
          processing={processing}
          message={message}
        />
      )}
    </>
  );
}

function BilliardView({ mejas }: { mejas: Meja[] }) {
  const activeMejas = mejas.filter(m => m.status === 'dipakai');
  const availableMejas = mejas.filter(m => m.status === 'tersedia');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
      <div className="glass-card rounded-xl p-lg">
        <h4 className="font-headline-md text-on-surface mb-md">Active Sessions</h4>
        {activeMejas.length === 0 ? (
          <p className="text-on-surface-variant font-label-md text-center py-xl">No active sessions</p>
        ) : (
          <div className="space-y-md">
            {activeMejas.map(m => (
              <div key={m.id} className="flex items-center justify-between p-md rounded-lg bg-surface-container-low border border-primary/20 active-glow">
                <div>
                  <p className="font-label-md text-primary">Table {String(m.nomor_meja).padStart(2, '0')}</p>
                  <p className="font-label-sm text-on-surface-variant">{m.keterangan || 'In use'}</p>
                </div>
                <span className="material-symbols-outlined text-primary">timer</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="glass-card rounded-xl p-lg">
        <h4 className="font-headline-md text-on-surface mb-md">Available Tables</h4>
        <div className="grid grid-cols-2 gap-md">
          {availableMejas.map(m => (
            <div key={m.id} className="p-md rounded-lg bg-surface-container-low border border-outline-variant/10 text-center hover:border-primary/40 transition-all cursor-pointer">
              <p className="font-label-md text-primary">Table {String(m.nomor_meja).padStart(2, '0')}</p>
              <p className="font-label-sm text-on-surface-variant capitalize">{m.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CafeView({
  products, cart, addToCart, updateQty, removeFromCart, clearCart,
  subtotal, tax, total, paymentMethod, setPaymentMethod, handleCheckout,
  processing, message
}: {
  products: Product[]; cart: CartItem[]; addToCart: (p: Product) => void;
  updateQty: (id: number, d: number) => void; removeFromCart: (id: number) => void;
  clearCart: () => void; subtotal: number; tax: number; total: number;
  paymentMethod: string; setPaymentMethod: (m: 'cash' | 'qris') => void;
  handleCheckout: () => Promise<void>; processing: boolean; message: string | null;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-lg">
      {/* Product Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
          {products.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="group flex flex-col bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-left"
            >
              <div className="aspect-[16/10] bg-surface-container-highest overflow-hidden relative flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 group-hover:scale-110 transition-transform">
                  {product.product_type === 'makanan' ? 'restaurant' : 'local_cafe'}
                </span>
                <div className="absolute top-3 right-3 px-3 py-1 bg-surface/90 backdrop-blur-md rounded-full text-primary font-bold text-label-md">
                  Rp {parseInt(product.price).toLocaleString('id-ID')}
                </div>
                {product.stock <= 5 && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-error/90 text-on-error text-[10px] font-bold rounded-full">
                    {product.stock} left
                  </div>
                )}
              </div>
              <div className="p-lg">
                <h3 className="font-headline-md text-on-surface mb-xs">{product.name}</h3>
                <p className="text-on-surface-variant text-label-sm mb-lg line-clamp-1">{product.product_type || 'Product'}</p>
                <div className="flex items-center justify-between text-primary">
                  <span className="font-label-md">Add to Order</span>
                  <span className="material-symbols-outlined">add_circle</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <aside className="w-full lg:w-[400px] flex flex-col bg-surface-container-low rounded-2xl p-lg border border-outline-variant/10 shadow-2xl h-fit lg:sticky lg:top-24">
        <div className="flex justify-between items-center mb-lg">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Current Order</h2>
          <button onClick={clearCart} className="text-on-surface-variant hover:text-error transition-colors font-label-md uppercase tracking-wider">Clear</button>
        </div>

        {/* Payment Method */}
        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/10 mb-lg">
          <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mb-sm">Payment Method</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`flex-1 py-2 border rounded-lg font-bold text-sm transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/20 bg-surface text-on-surface-variant hover:border-primary/40'}`}
            >
              Cash
            </button>
            <button
              onClick={() => setPaymentMethod('qris')}
              className={`flex-1 py-2 border rounded-lg font-bold text-sm transition-all ${paymentMethod === 'qris' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/20 bg-surface text-on-surface-variant hover:border-primary/40'}`}
            >
              QRIS
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-md mb-lg max-h-80 custom-scrollbar" id="cart-container">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-on-surface-variant/40 py-xl">
              <span className="material-symbols-outlined text-6xl mb-md">shopping_cart_checkout</span>
              <p className="font-body-md">Order is empty</p>
              <p className="text-label-sm">Select items to add</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex items-center justify-between p-md bg-surface rounded-xl border border-outline-variant/10 group hover:border-primary/20 transition-colors">
                <div className="flex-1 min-w-0 mr-4">
                  <h4 className="font-label-md text-on-surface truncate">{item.name}</h4>
                  <p className="text-primary font-bold">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-surface-container-high rounded-lg p-1 border border-outline-variant/20">
                    <button onClick={() => updateQty(item.productId, -1)} className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">-</button>
                    <span className="w-6 text-center font-bold text-on-surface">{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, 1)} className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="material-symbols-outlined text-on-error/40 hover:text-error transition-colors">delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="space-y-md pt-lg border-t border-outline-variant/10">
          <div className="flex justify-between font-label-md text-on-surface-variant">
            <span>Subtotal</span>
            <span className="font-bold" id="subtotal">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between font-label-md text-on-surface-variant">
            <span>PPN (12%)</span>
            <span className="font-bold">Rp {tax.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-end mt-2">
            <span className="font-headline-lg text-headline-lg">Total</span>
            <span className="font-headline-lg text-headline-lg text-primary">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {message && (
          <div className={`mt-3 px-4 py-3 rounded-xl font-label-md ${
            message.includes('✅') ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
          }`}>
            {message}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0 || processing}
          className="mt-lg w-full py-4 bg-primary text-on-primary font-bold rounded-xl active:scale-95 transition-all shadow-[0_0_20px_rgba(107,251,154,0.15)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
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
  );
}
