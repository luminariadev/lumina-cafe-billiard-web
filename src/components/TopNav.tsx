'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════
// Mobile drawer nav items — role-based
// ═══════════════════════════════════════════════
const ROLE_NAV: Record<string, { href: string; icon: string; label: string }[]> = {
  admin: [
    { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/meja', icon: 'table_restaurant', label: 'Meja' },
    { href: '/pos', icon: 'point_of_sale', label: 'POS Billiard' },
    { href: '/transaksis', icon: 'receipt_long', label: 'Transaksi' },
    { href: '/reports', icon: 'bar_chart', label: 'Reports' },
    { href: '/products', icon: 'inventory_2', label: 'Produk' },
    { href: '/categories', icon: 'category', label: 'Kategori' },
  ],
  kasir_billiard: [
    { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/meja', icon: 'table_restaurant', label: 'Meja' },
    { href: '/pos', icon: 'point_of_sale', label: 'POS Billiard' },
    { href: '/transaksis', icon: 'receipt_long', label: 'Transaksi' },
  ],
  kasir_cafe: [
    { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/pos', icon: 'free_breakfast', label: 'POS Cafe' },
    { href: '/transaksis', icon: 'receipt_long', label: 'Transaksi' },
  ],
};

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/meja': 'Billiard Tables',
  '/pos': 'Point of Sale',
  '/transaksis': 'Transactions',
  '/reports': 'Reports',
  '/products': 'Products',
  '/categories': 'Categories',
};

export default function TopNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [showSidebar, setShowSidebar] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Tutup mobile sidebar saat ganti halaman
  useEffect(() => {
    setShowSidebar(false);
  }, [pathname]);

  const pageTitle = PAGE_TITLES[pathname] || 'Lumina';
  const role = user?.role ?? 'admin';
  const navItems = ROLE_NAV[role] || ROLE_NAV.admin;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* ════════════════════════════════════════
          Mobile drawer
          ════════════════════════════════════════ */}
      {showSidebar && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSidebar(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-black border-r border-gray-800 flex flex-col shadow-2xl">
            {/* Logo */}
            <div className="p-5 border-b border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>sports_bar</span>
              </div>
              <div>
                <h1 className="text-xl font-bold font-[Montserrat] text-green-400 leading-none">Lumina</h1>
                <p className="text-gray-500 text-xs mt-1">Billiard & Cafe</p>
              </div>
            </div>
            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map(({ href, icon, label }) => {
                const isActive = pathname === href;
                return (
                  <a
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-green-400/10 text-green-400 border-r-[3px] border-green-400 font-semibold'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                    <span className="text-sm">{label}</span>
                  </a>
                );
              })}
            </nav>
            {/* User */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-gray-400" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.role_label || 'Staff'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          Top header
          ════════════════════════════════════════ */}
      <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex md:hidden items-center gap-2">
              <div className="w-8 h-8 bg-green-400/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-green-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>sports_bar</span>
              </div>
              <h1 className="text-lg font-bold font-[Montserrat] text-green-400">Lumina</h1>
            </div>
          </div>

          {/* Desktop title */}
          <h2 className="text-lg font-semibold font-[Montserrat] text-green-400 hidden md:block">{pageTitle}</h2>

          {/* Right */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">search</span>
            </button>

            <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-all relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-400 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg transition-all"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-300 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
                </div>
                <span className="material-symbols-outlined text-gray-400 text-sm hidden sm:block">
                  {showUserMenu ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm font-medium text-gray-200">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.role_label || 'Staff'}</p>
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

        {showSearch && (
          <div className="px-4 sm:px-6 pb-3 sm:pb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 outline-none focus:border-green-400 transition-colors"
              autoFocus
            />
          </div>
        )}
      </header>
    </>
  );
}
