'use client';

import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory, Category } from '@/lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saveLoading, setSaveLoading] = useState(false);

  const load = () =>
    getCategories()
      .then(data => setCategories(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaveLoading(true);
    try {
      if (editing) {
        const updated = await updateCategory(editing.id, { name: form.name, description: form.description });
        setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, ...updated } : c));
      } else {
        const created = await createCategory({ name: form.name, description: form.description });
        setCategories(prev => [...prev, created]);
      }
      setShowModal(false);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus category ini?')) return;
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><span className="material-symbols-outlined text-green-400 text-5xl animate-pulse">category</span></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold font-[Montserrat] text-gray-200">Categories</h2>
          <p className="text-gray-400 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="bg-green-400 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add</span> ADD
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="glass-card p-6 rounded-xl hover:shadow-[0_0_20px_0_rgba(107,251,154,0.15)] transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-400/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(cat)} className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-800 rounded-lg transition-all">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold font-[Montserrat] text-gray-200 mb-1">{cat.name}</h3>
            {cat.description && <p className="text-sm text-gray-400">{cat.description}</p>}
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="glass-card w-full max-w-md p-8 rounded-3xl relative z-10 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-[Montserrat] text-green-400">{editing ? 'EDIT CATEGORY' : 'NEW CATEGORY'}</h2>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">NAME</label>
                <input className="w-full bg-[#0A0A0A] border border-gray-700/30 rounded-xl p-4 text-gray-200 outline-none focus:ring-2 focus:ring-green-400" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Category name" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">DESCRIPTION (optional)</label>
                <textarea className="w-full bg-[#0A0A0A] border border-gray-700/30 rounded-xl p-4 text-gray-200 outline-none focus:ring-2 focus:ring-green-400 min-h-[100px]" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-700 text-gray-200 font-bold py-3 rounded-2xl hover:bg-gray-800 transition-all">CANCEL</button>
                <button onClick={handleSave} disabled={saveLoading || !form.name.trim()} className="flex-[2] bg-green-400 text-black font-bold py-3 rounded-2xl active:scale-95 transition-all disabled:opacity-50">
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
