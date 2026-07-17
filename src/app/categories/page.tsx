'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getCategories, createCategory, Category } from "@/lib/api";

export default function CategoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && user?.role !== "admin") router.push("/dashboard");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setCategories(await getCategories());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createCategory({ name: newName });
      setNewName("");
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (authLoading || loading) return <div className="text-center py-20 text-6xl animate-pulse">🎱</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Kategori</h1>

      <form onSubmit={handleCreate} className="flex gap-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nama kategori baru"
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold transition-colors"
        >
          Tambah
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((c) => (
          <div key={c.id} className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
            <div className="text-white font-medium">{c.name}</div>
            {c.description && <div className="text-xs text-gray-400 mt-1">{c.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
