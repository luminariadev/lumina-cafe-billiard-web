'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface NavLinkProps {
  href: string;
  icon: string;
  label: string;
  role?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, label, role }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const isActive = pathname === href;

  if (role && user?.role !== 'admin' && user?.role !== role) {
    return null; // Only show if role matches or if admin
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${isActive
          ? 'text-primary font-bold border-r-4 border-primary bg-primary/5'
          : 'text-[#e5e2e1]-variant font-medium hover:bg-[#201f1f]-high hover:text-primary'
        }`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-label-md text-label-md">{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  const { user, logout } = useAuth();

  if (!user) return null; // Only show sidebar if user is logged in

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#1c1b1b] border-r border-[#869486]-variant/10 flex flex-col py-lg px-md z-50 hidden md:flex">
      {/* Brand Logo */}
      <div className="mb-xl flex items-center gap-sm">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>sports_bar</span>
        </div>
        <div>
          <h1 className="font-headline-md text-primary font-black leading-none">Lumina</h1>
          <p className="font-label-sm text-[#e5e2e1]-variant">Management Portal</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-xs overflow-y-auto custom-scrollbar">
        <NavLink href="/dashboard" icon="dashboard" label="Dashboard" />
        <NavLink href="/meja" icon="sports_bar" label="Billiards" role="kasir_billiard" />
        <NavLink href="/pos" icon="coffee" label="Cafe POS" role="kasir_cafe" /> {/* Changed to Cafe POS to reflect functionality */}
        <NavLink href="/products" icon="inventory_2" label="Products" role="admin" />
        <NavLink href="/categories" icon="category" label="Categories" role="admin" />
        <NavLink href="/transaksis" icon="receipt_long" label="Transactions" />
        <NavLink href="/reports" icon="assessment" label="Reports" />
      </nav>

      {/* Footer Nav */}
      <div className="mt-auto border-t border-[#869486]-variant/10 pt-md space-y-xs">
        <Link href="/settings" className="flex items-center gap-4 p-4 rounded-lg text-[#e5e2e1]-variant font-medium hover:bg-[#201f1f]-high transition-colors">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-md text-label-md">Settings</span>
        </Link>
        <div className="flex items-center gap-4 p-md">
          <div className="w-10 h-10 rounded-full bg-[#201f1f]-highest overflow-hidden">
            {/* Placeholder for user avatar - replace with actual image from user object if available */}
            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-ES4y8GI_FnkGLwTkDK71oHKJPLsZVI4RBviK469OKxQfYMWXGf0KwDNGKJSLwizb_ct66RgQClQ_8DL64Zi-po3OQi4Y_f0_JUgI-XW4YBKhzQ2NYBz_-HAwo29uERuB-Zj-OEn1kYCYd5fRVb6uyUNbmEETFhFY3FTwutQArdX-wI9MAwJBr9DRznPnxBrh0OqHIBIQjbovZ-ARirCI7KJAGJgellwyec-YDiIXAY2HLE5DRH7v" alt="User Avatar" width={40} height={40} objectFit="cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label-md text-[#e5e2e1] truncate">{user?.name || 'User'}</p>
            <p className="font-label-sm text-[#e5e2e1]-variant truncate">{user?.role === 'admin' ? 'Master Account' : user?.role}</p>
          </div>
          <button className="text-[#e5e2e1]-variant hover:text-error transition-colors" onClick={logout}>
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
