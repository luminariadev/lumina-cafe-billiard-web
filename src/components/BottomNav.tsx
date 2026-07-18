'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'grid_view' },
  { href: '/meja', icon: 'sports_bar' },
  { href: '/pos', icon: 'point_of_sale' },
  { href: '/transaksis', icon: 'receipt_long' },
  { href: '/reports', icon: 'assessment' },
  { href: '/products', icon: 'inventory_2' },
  { href: '/categories', icon: 'category' },
];

export default function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
      <div className="flex items-center justify-around px-1 py-1">
        {NAV_ITEMS.map(({ href, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                isActive
                  ? 'bg-green-400/15 text-green-400'
                  : 'text-gray-500 hover:text-gray-300 active:bg-gray-800'
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}