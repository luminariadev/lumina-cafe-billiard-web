'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface NavLinkProps {
  href: string;
  icon: string;
  label: string;
}

function NavLink({ href, icon, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive
          ? 'bg-green-400/10 text-green-400 border-r-[3px] border-green-400 font-semibold'
          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
      }`}
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-black border-r border-gray-800 fixed h-full z-30">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-400/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>sports_bar</span>
          </div>
          <h1 className="text-xl font-bold font-[Montserrat] text-green-400 leading-none">Lumina</h1>
        </div>
        <p className="text-gray-500 text-xs mt-2">Billiard & Cafe Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <NavLink href="/dashboard" icon="dashboard" label="Dashboard" />
        <NavLink href="/meja" icon="table_restaurant" label="Billiard Tables" />
        <NavLink href="/pos" icon="point_of_sale" label="POS" />
        <NavLink href="/transaksis" icon="receipt_long" label="Transactions" />
        <NavLink href="/reports" icon="bar_chart" label="Reports" />
        <NavLink href="/products" icon="inventory_2" label="Products" />
        <NavLink href="/categories" icon="category" label="Categories" />
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-gray-400" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ') || 'Staff'}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Logout"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}