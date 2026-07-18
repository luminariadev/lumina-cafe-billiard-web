'use client';

import { useState, useEffect } from 'react';
import { getCategories, Category } from '@/lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><span className="material-symbols-outlined text-green-400 text-5xl animate-pulse">category</span></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold font-[Montserrat] text-gray-200">Categories</h2>
        <p className="text-gray-400 text-sm mt-1">Manage product categories</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="glass-card p-6 rounded-xl hover:shadow-[0_0_20px_0_rgba(107,251,154,0.15)] transition-shadow">
            <div className="w-12 h-12 bg-green-400/10 rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-green-400">category</span>
            </div>
            <h3 className="text-lg font-semibold font-[Montserrat] text-gray-200 mb-1">{cat.name}</h3>
            {cat.description && <p className="text-sm text-gray-400">{cat.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
