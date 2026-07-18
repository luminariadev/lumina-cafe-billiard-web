'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/meja': 'Billiard Tables',
  '/pos': 'Point of Sale',
  '/transaksis': 'Transactions',
  '/reports': 'Reports',
  '/products': 'Products',
  '/categories': 'Categories',
};

export default function MainTopNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const pageTitle = PAGE_TITLES[pathname] || 'Lumina';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-gray-800">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile logo */}
        <div className="flex md:hidden items-center gap-3">
          <div className="w-8 h-8 bg-green-400/10 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-green-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>sports_bar</span>
          </div>
          <h1 className="text-lg font-bold font-[Montserrat] text-green-400">Lumina</h1>
        </div>

        {/* Page title - desktop */}
        <h2 className="text-lg font-semibold font-[Montserrat] text-green-400 hidden md:block">{pageTitle}</h2>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-all relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-400 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg transition-all"
            >
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-300 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
              </div>
              <span className="material-symbols-outlined text-gray-400 text-sm hidden sm:block">
                {showUserMenu ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-sm font-medium text-gray-200">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ') || 'Staff'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all text-sm"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="px-6 pb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 outline-none focus:border-green-400 transition-colors"
            autoFocus
          />
        </div>
      )}
    </header>
  );
}