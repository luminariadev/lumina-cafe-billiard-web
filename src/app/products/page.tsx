'use client';

import { useState, useEffect } from 'react';
import { getProducts, getCategories, Product, Category } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p || []);
        setCategories(c || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center"><span className="material-symbols-outlined text-primary text-6xl animate-pulse">inventory_2</span></div>;

  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

  return (
    <>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h2 className="font-headline-md text-[#e5e2e1]">Products</h2>
          <p className="font-label-sm text-[#e5e2e1]-variant">Manage your cafe & billiard products</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
        {products.map(p => (
          <div key={p.id} className="glass-card rounded-xl p-6 glow-hover transition-all">
            <div className="w-full h-32 bg-[#201f1f]-highest rounded-lg flex items-center justify-center mb-lg">
              <span className="material-symbols-outlined text-4xl text-[#e5e2e1]-variant/30">
                {p.product_type === 'makanan' ? 'restaurant' : 'local_cafe'}
              </span>
            </div>
            <h3 className="font-headline-md text-[#e5e2e1] mb-xs">{p.name}</h3>
            <p className="font-label-sm text-[#e5e2e1]-variant mb-lg">{categoryMap[p.category_id] || '-'}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-primary text-headline-md">Rp {parseInt(p.price).toLocaleString('id-ID')}</span>
              <span className={`font-label-sm ${p.stock > 5 ? 'text-[#e5e2e1]-variant' : 'text-error'}`}>
                Stock: {p.stock}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
