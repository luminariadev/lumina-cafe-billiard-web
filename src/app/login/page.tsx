'use client';

import { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Billiard Balls Background */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="ball ball-1"></div>
        <div className="ball ball-2"></div>
        <div className="ball ball-3"></div>
        <div className="ball ball-4"></div>
        <div className="ball ball-5"></div>
        <div className="ball ball-6"></div>
        <div className="ball ball-7"></div>
        <div className="ball ball-8"></div>
        <div className="ball ball-9"></div>
        <div className="ball ball-10"></div>
        <div className="ball ball-11"></div>
        <div className="ball ball-12"></div>
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 sm:p-10 rounded-2xl text-center shadow-2xl">
          {/* Logo */}
          <div className="w-16 h-16 bg-green-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(107,251,154,0.2)]">
            <span className="material-symbols-outlined text-green-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>sports_bar</span>
          </div>

          <h1 className="text-3xl font-bold font-[Montserrat] text-green-400 mb-1">Lumina</h1>
          <p className="text-gray-400 text-sm mb-8">Billiard & Cafe Management</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-left">
              <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2 uppercase tracking-wider" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 rounded-xl bg-gray-900/80 border border-gray-700/30 focus:border-green-400 focus:ring-1 focus:ring-green-400/50 outline-none transition-all text-gray-200 placeholder-gray-600 text-sm sm:text-base"
                placeholder="Enter your username..."
                required
                autoComplete="username"
              />
            </div>

            <div className="text-left">
              <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-xl bg-gray-900/80 border border-gray-700/30 focus:border-green-400 focus:ring-1 focus:ring-green-400/50 outline-none transition-all text-gray-200 placeholder-gray-600 text-sm sm:text-base"
                placeholder="Enter your password..."
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 sm:py-4 bg-green-400 text-black font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-green-400/20 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex justify-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-green-400/30" style={{ fontSize: '12px' }}>sports_bar</span>
                Billiards
              </span>
              <span className="text-gray-700">|</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-green-400/30" style={{ fontSize: '12px' }}>local_cafe</span>
                Cafe
              </span>
            </div>
          </div>
        </div>

        {/* Demo accounts hint */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-[10px] sm:text-xs">Demo: admin / admin123 &nbsp;|&nbsp; kasir_billiard / kasir123</p>
        </div>
      </div>
    </div>
  );
}