'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { MainTopNav } from './TopNav';
import BottomNav from './BottomNav';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <span className="material-symbols-outlined text-primary text-6xl animate-pulse">sports_bar</span>
          <p className="mt-4 text-[#e5e2e1]-variant font-label-md">Loading...</p>
        </div>
      </div>
    );
  }

  // If on login page, don't show layout
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // If not logged in, don't show layout (redirect will happen via useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="md:ml-64 min-h-screen flex flex-col flex-1">
        <MainTopNav />
        <div className="p-lg max-w-[1440px] mx-auto w-full space-y-lg">
          {children}
        </div>
        <BottomNav />
      </main>
    </div>
  );
}