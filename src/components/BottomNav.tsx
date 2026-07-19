'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ═══════════════════════════════════════════════
// BottomNav — max 5 items, role-based
// ═══════════════════════════════════════════════
const ROLE_NAV: Record<string, { href: string; icon: string }[]> = {
  admin: [
    { href: '/dashboard', icon: 'dashboard' },
    { href: '/meja', icon: 'sports_bar' },
    { href: '/pos', icon: 'point_of_sale' },
    { href: '/transaksis', icon: 'receipt_long' },
    { href: '/reports', icon: 'assessment' },
  ],
  kasir_billiard: [
    { href: '/dashboard', icon: 'dashboard' },
    { href: '/meja', icon: 'sports_bar' },
    { href: '/pos', icon: 'point_of_sale' },
    { href: '/transaksis', icon: 'receipt_long' },
  ],
  kasir_cafe: [
    { href: '/dashboard', icon: 'dashboard' },
    { href: '/pos', icon: 'free_breakfast' },
    { href: '/transaksis', icon: 'receipt_long' },
  ],
};

export default function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  if (!user) return null;

  const items = ROLE_NAV[user.role] || ROLE_NAV.admin;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
      <div className="flex items-center justify-around px-1 py-1">
        {items.map(({ href, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
                isActive
                  ? 'bg-green-400/15 text-green-400'
                  : 'text-gray-500 active:bg-gray-800'
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
