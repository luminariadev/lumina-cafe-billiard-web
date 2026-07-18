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
    <div className="min-h-screen bg-black">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 md:ml-64 flex flex-col min-h-screen">
          <MainTopNav />
          <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6 w-full max-w-[1440px] mx-auto pb-24 md:pb-6">
            {children}
          </div>
          <BottomNav />
        </main>
      </div>
    </div>
  );
}