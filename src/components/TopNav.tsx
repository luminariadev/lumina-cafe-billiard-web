'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/meja': 'Billiards',
  '/pos': 'Cafe POS',
  '/products': 'Products',
  '/categories': 'Categories',
  '/transaksis': 'Transactions',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function TopNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageTitle = PAGE_TITLES[pathname] || 'Lumina';

  if (!user) return null;

  return (
    <>
      <Sidebar />
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title={pageTitle}
      />
    </>
  );
}

function MobileNav({ isOpen, onClose, title }: { isOpen: boolean; onClose: () => void; title: string }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Menu content */}
      <aside className="absolute left-0 top-0 h-full w-72 bg-[#1c1b1b] flex flex-col py-lg px-md shadow-2xl">
        {/* Brand */}
        <div className="mb-xl flex items-center gap-sm">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>sports_bar</span>
          </div>
          <div>
            <h1 className="font-headline-md text-primary font-black leading-none">Lumina</h1>
            <p className="font-label-sm text-[#e5e2e1]-variant">Management Portal</p>
          </div>
        </div>
        {/* Links */}
        <nav className="flex-1 space-y-xs">
          {Object.entries(PAGE_TITLES).map(([path, label]) => (
            <a
              key={path}
              href={path}
              className="flex items-center gap-4 p-4 rounded-lg text-[#e5e2e1]-variant font-medium hover:bg-[#201f1f]-high hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">
                {path === '/dashboard' ? 'dashboard' :
                 path === '/meja' ? 'sports_bar' :
                 path === '/pos' ? 'coffee' :
                 path === '/products' ? 'inventory_2' :
                 path === '/categories' ? 'category' :
                 path === '/transaksis' ? 'receipt_long' :
                 path === '/reports' ? 'assessment' :
                 path === '/settings' ? 'settings' : 'circle'}
              </span>
              <span className="font-label-md">{label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </div>
  );
}

export function MainTopNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageTitle = PAGE_TITLES[pathname] || 'Lumina';

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-[#869486]-variant/10 shadow-sm">
      <div className="flex justify-between items-center w-full px-lg py-md max-w-[1440px] mx-auto">
        <div className="flex items-center gap-md">
          <button
            className="md:hidden text-[#e5e2e1] p-2 hover:bg-[#201f1f]-high rounded-lg"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h2 className="font-headline-md text-primary font-black hidden md:block">{pageTitle}</h2>
        </div>
        <div className="flex-1 max-w-xl mx-lg hidden sm:block">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#e5e2e1]-variant group-focus-within:text-primary transition-colors">search</span>
            <input
              className="w-full bg-[#1c1b1b]est border-[#869486]-variant/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-full py-2 pl-12 pr-4 text-body-md transition-all outline-none text-[#e5e2e1] placeholder-on-surface-variant"
              placeholder="Search tables, orders, or members..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button className="p-2 rounded-full hover:bg-[#201f1f] text-[#e5e2e1]-variant relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-[#201f1f] text-[#e5e2e1]-variant">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <MobileSidebar onClose={() => setMobileMenuOpen(false)} />
      )}
    </header>
  );
}

function MobileSidebar({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="fixed inset-0 z-[70] md:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute left-0 top-0 h-full w-72 bg-[#1c1b1b] flex flex-col py-lg px-md shadow-2xl">
        <div className="mb-xl flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>sports_bar</span>
            </div>
            <div>
              <h1 className="font-headline-md text-primary font-black leading-none">Lumina</h1>
              <p className="font-label-sm text-[#e5e2e1]-variant">Management Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#201f1f]-high rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 space-y-xs overflow-y-auto custom-scrollbar">
          {Object.entries(PAGE_TITLES).map(([path, label]) => (
            <a
              key={path}
              href={path}
              className="flex items-center gap-4 p-4 rounded-lg text-[#e5e2e1]-variant font-medium hover:bg-[#201f1f]-high hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">
                {path === '/dashboard' ? 'dashboard' :
                 path === '/meja' ? 'sports_bar' :
                 path === '/pos' ? 'coffee' :
                 path === '/products' ? 'inventory_2' :
                 path === '/categories' ? 'category' :
                 path === '/transaksis' ? 'receipt_long' :
                 path === '/reports' ? 'assessment' :
                 path === '/settings' ? 'settings' : 'circle'}
              </span>
              <span className="font-label-md">{label}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto border-t border-[#869486]-variant/10 pt-md space-y-xs">
          <div className="flex items-center gap-4 p-md">
            <div className="w-10 h-10 rounded-full bg-[#201f1f]-highest overflow-hidden">
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-label-md text-[#e5e2e1] truncate">{user?.name || 'User'}</p>
              <p className="font-label-sm text-[#e5e2e1]-variant truncate">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-4 p-4 rounded-lg text-[#e5e2e1]-variant font-medium hover:bg-[#201f1f]-high hover:text-error transition-colors w-full">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md">Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
}