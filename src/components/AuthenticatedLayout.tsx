'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import MainTopNav from './TopNav';
import BottomNav from './BottomNav';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-green-400 text-6xl animate-pulse">sports_bar</span>
          <p className="mt-4 text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="md:ml-64 min-h-screen flex flex-col flex-1">
        <MainTopNav />
        <div className="p-6 max-w-[1440px] mx-auto w-full space-y-6">
          {children}
        </div>
        <BottomNav />
      </main>
    </div>
  );
}