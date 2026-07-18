'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Sidebar from './Sidebar';

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'grid_view', label: 'Dashboard' },
  { href: '/meja', icon: 'sports_bar', label: 'Tables' },
  { href: '/pos', icon: 'local_cafe', label: 'POS' },
  { href: '/transaksis', icon: 'receipt_long', label: 'Orders' },
  { href: '/reports', icon: 'assessment', label: 'Reports' },
  { href: '/products', icon: 'inventory_2', label: 'Products' },
  { href: '/categories', icon: 'category', label: 'Categories' },
];

export default function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  if (!user) return null;

  // Show first 5 + "More" button, or all 7 if expanded
  const visibleItems = showMore ? NAV_ITEMS : NAV_ITEMS.slice(0, 5);
  const moreItems = NAV_ITEMS.slice(5);

  return (
    <>
      {/* More Menu Overlay */}
      {showMore && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="absolute bottom-24 left-4 right-4 bg-gray-900 border border-gray-800 rounded-2xl p-3 shadow-2xl">
            <p className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2">More Menu</p>
            {moreItems.map(({ href, icon, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setShowMore(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-green-400/10 text-green-400 font-semibold'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 py-2 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-30 shadow-lg">
        {visibleItems.map(({ href, icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setShowMore(false)}
              className={`flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-green-400'
                  : 'text-gray-500 hover:text-gray-200'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${isActive ? 'text-green-400' : ''}`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {icon}
              </span>
              <span className="text-[10px] mt-0.5 font-medium">{label}</span>
            </Link>
          );
        })}
        {moreItems.length > 0 && (
          <button
            onClick={() => setShowMore(true)}
            className="flex flex-col items-center justify-center px-2 py-1 rounded-xl text-gray-500"
          >
            <span className="material-symbols-outlined text-xl">more_horiz</span>
            <span className="text-[10px] mt-0.5 font-medium">More</span>
          </button>
        )}
      </nav>
    </>
  );
}