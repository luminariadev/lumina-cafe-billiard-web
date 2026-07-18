'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface NavLinkProps {
  href: string;
  icon: string;
  label: string;
  onClick?: () => void;
}

function NavLink({ href, icon, label, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
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

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <aside className="flex flex-col w-72 md:w-64 bg-black border-r border-gray-800 h-full md:fixed z-30 overflow-y-auto">
      {/* Logo */}
      <div className="p-5 md:p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>sports_bar</span>
          </div>
          <div>
            <h1 className="text-xl font-bold font-[Montserrat] text-green-400 leading-none">Lumina</h1>
            <p className="text-gray-500 text-xs mt-1">Billiard & Cafe Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 md:p-4 space-y-1">
        <NavLink href="/dashboard" icon="dashboard" label="Dashboard" onClick={onClose} />
        <NavLink href="/meja" icon="table_restaurant" label="Billiard Tables" onClick={onClose} />
        <NavLink href="/pos" icon="point_of_sale" label="POS" onClick={onClose} />
        <NavLink href="/transaksis" icon="receipt_long" label="Transactions" onClick={onClose} />
        <NavLink href="/reports" icon="bar_chart" label="Reports" onClick={onClose} />
        <NavLink href="/products" icon="inventory_2" label="Products" onClick={onClose} />
        <NavLink href="/categories" icon="category" label="Categories" onClick={onClose} />
      </nav>

      {/* User */}
      <div className="p-3 md:p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="material-symbols-outlined text-gray-400" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ') || 'Staff'}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
            title="Logout"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}