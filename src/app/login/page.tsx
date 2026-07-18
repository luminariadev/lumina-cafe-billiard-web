'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      // Redirect handled by AuthContext
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-2xl text-on-surface text-center shadow-lg">
        <div className="mb-8">
          <h1 className="font-headline-lg text-primary text-4xl font-black mb-2">Cue & Brew</h1>
          <p className="text-on-surface-variant text-lg">Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-left text-label-md text-on-surface-variant mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-left text-label-md text-on-surface-variant mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-error text-label-md text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl text-headline-md shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
