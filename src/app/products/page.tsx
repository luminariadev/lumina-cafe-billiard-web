'use client';

import { useState, useEffect } from 'react';
import { getProducts, getCategories, Product, Category } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      setProducts(p || []);
      setCategories(c || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><span className="material-symbols-outlined text-green-400 text-5xl animate-pulse">inventory_2</span></div>;

  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold font-[Montserrat] text-gray-200">Products</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your cafe & billiard products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p.id} className="glass-card rounded-xl overflow-hidden hover:shadow-[0_0_20px_0_rgba(107,251,154,0.15)] transition-shadow">
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
    </div>
  );
}