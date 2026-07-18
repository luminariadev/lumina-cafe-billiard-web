'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'grid_view', label: 'Dashboard' },
  { href: '/meja', icon: 'sports_bar', label: 'Tables' },
  { href: '/pos', icon: 'local_cafe', label: 'Cafe' },
  { href: '/transaksis', icon: 'receipt_long', label: 'Orders' },
  { href: '/reports', icon: 'assessment', label: 'Reports' },
];

export default function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 pb-safe bg-[#201f1f]-high/90 backdrop-blur-md border-t border-[#869486]-variant/10 z-50 rounded-t-xl shadow-lg">
      {NAV_ITEMS.map(({ href, icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center rounded-full px-3 py-1 active:scale-90 duration-200 ${
              isActive
                ? 'bg-primary-container text-on-primary-container'
                : 'text-gray-200-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span className="font-label-sm text-label-sm">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}