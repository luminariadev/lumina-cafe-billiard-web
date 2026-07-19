'use client';

import { useState, useEffect } from 'react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, Product, Category } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', price: '', stock: 0, category_id: 0, product_type: 'makanan' });

  const load = () =>
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => { setProducts(p || []); setCategories(c || []); })
      .catch(console.error).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', price: '', stock: 0, category_id: categories[0]?.id || 0, product_type: 'makanan' });
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, price: p.price, stock: p.stock, category_id: p.category_id, product_type: p.product_type });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      if (editing) {
        const updated = await updateProduct(editing.id, { name: form.name, price: form.price, stock: form.stock, category_id: form.category_id, product_type: form.product_type });
        setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...updated } : p));
      } else {
        const created = await createProduct({ name: form.name, price: form.price, stock: form.stock, category_id: form.category_id, product_type: form.product_type });
        setProducts(prev => [...prev, created]);
      }
      setShowModal(false);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus produk ini?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><span className="material-symbols-outlined text-green-400 text-5xl animate-pulse">inventory_2</span></div>;

  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold font-[Montserrat] text-gray-200">Products</h2>
          <p className="text-gray-400 text-sm mt-1">{products.length} items</p>
        </div>
        <button onClick={openCreate} className="bg-green-400 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add</span> ADD PRODUCT
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(p => (
          <div
            key={p.id}
            onClick={() => setPreviewProduct(p)}
            className="glass-card rounded-xl overflow-hidden hover:shadow-[0_0_20px_0_rgba(107,251,154,0.15)] transition-shadow cursor-pointer"
          >
            <div className="h-32 bg-gray-900 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-gray-600">
                {p.product_type === 'makanan' ? 'restaurant' : 'local_cafe'}
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="text-lg font-semibold font-[Montserrat] text-gray-200">{p.name}</h3>
              <p className="text-sm text-gray-400">{categoryMap[p.category_id] || '-'}</p>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-green-400 text-xl">Rp {parseInt(p.price).toLocaleString('id-ID')}</span>
                <span className={`text-xs font-medium ${p.stock > 5 ? 'text-gray-400' : 'text-red-400'}`}>Stock: {p.stock}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview/Edit Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewProduct(null)} />
          <div className="glass-card w-full max-w-lg p-8 rounded-3xl relative z-10 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold font-[Montserrat] text-green-400">{previewProduct.name}</h2>
                <p className="text-sm text-gray-400">{categoryMap[previewProduct.category_id] || '-'} · {previewProduct.product_type}</p>
              </div>
              <button onClick={() => setPreviewProduct(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-400">Price</span><span className="text-green-400 font-bold">Rp {parseInt(previewProduct.price).toLocaleString('id-ID')}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Stock</span><span className="font-medium">{previewProduct.stock}</span></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { openEdit(previewProduct); setPreviewProduct(null); }} className="flex-1 border border-green-400/30 text-green-400 font-bold py-3 rounded-2xl hover:bg-green-400/10 transition-all">
                EDIT
              </button>
              <button onClick={() => { handleDelete(previewProduct.id); setPreviewProduct(null); }} className="flex-1 border border-red-400/30 text-red-400 font-bold py-3 rounded-2xl hover:bg-red-500/10 transition-all">
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="glass-card w-full max-w-lg p-8 rounded-3xl relative z-10 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-[Montserrat] text-green-400">{editing ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</h2>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">NAME</label>
                <input className="w-full bg-[#0A0A0A] border border-gray-700/30 rounded-xl p-4 text-gray-200 outline-none focus:ring-2 focus:ring-green-400" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">PRICE (Rp)</label>
                  <input type="number" className="w-full bg-[#0A0A0A] border border-gray-700/30 rounded-xl p-4 text-gray-200 outline-none focus:ring-2 focus:ring-green-400" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">STOCK</label>
                  <input type="number" className="w-full bg-[#0A0A0A] border border-gray-700/30 rounded-xl p-4 text-gray-200 outline-none focus:ring-2 focus:ring-green-400" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">CATEGORY</label>
                  <select className="w-full bg-[#0A0A0A] border border-gray-700/30 rounded-xl p-4 text-gray-200 outline-none focus:ring-2 focus:ring-green-400" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: Number(e.target.value) }))}>
                    <option value={0}>Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">TYPE</label>
                  <select className="w-full bg-[#0A0A0A] border border-gray-700/30 rounded-xl p-4 text-gray-200 outline-none focus:ring-2 focus:ring-green-400" value={form.product_type} onChange={e => setForm(f => ({ ...f, product_type: e.target.value }))}>
                    <option value="makanan">Food</option>
                    <option value="minuman">Drink</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-700 text-gray-200 font-bold py-3 rounded-2xl hover:bg-gray-800 transition-all">CANCEL</button>
                <button onClick={handleSave} disabled={saveLoading || !form.name || !form.price} className="flex-[2] bg-green-400 text-black font-bold py-3 rounded-2xl active:scale-95 transition-all disabled:opacity-50">
                  {saveLoading ? 'Saving...' : editing ? 'UPDATE' : 'CREATE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
