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

  if (loading) return <div className="flex justify-center"><span className="material-symbols-outlined text-primary text-6xl animate-pulse">category</span></div>;

  return (
    <>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h2 className="font-headline-md text-[#e5e2e1]">Categories</h2>
          <p className="font-label-sm text-[#e5e2e1]-variant">Manage product categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
        {categories.map(cat => (
          <div key={cat.id} className="glass-card p-6 rounded-xl glow-hover transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-lg">
              <span className="material-symbols-outlined text-primary">category</span>
            </div>
            <h3 className="font-headline-md text-[#e5e2e1] mb-xs">{cat.name}</h3>
            {cat.description && (
              <p className="font-label-sm text-[#e5e2e1]-variant">{cat.description}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
