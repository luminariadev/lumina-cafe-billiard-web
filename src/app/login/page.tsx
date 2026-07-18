'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-2xl text-center shadow-2xl">
        {/* Logo */}
        <div className="w-16 h-16 bg-green-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-green-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>sports_bar</span>
        </div>

        <h1 className="text-3xl font-bold font-[Montserrat] text-green-400 mb-1">Lumina</h1>
        <p className="text-gray-400 text-base mb-8">Management Portal</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700/30 focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none transition-all text-gray-200 placeholder-gray-600"
              placeholder="Enter username..."
              required
              autoComplete="username"
            />
          </div>

          <div className="text-left">
            <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700/30 focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none transition-all text-gray-200 placeholder-gray-600"
              placeholder="Enter password..."
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green-400 text-black font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-green-400/20 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-gray-600 text-xs mt-6">Billiard & Cafe Management System</p>
      </div>
    </div>
  );
}