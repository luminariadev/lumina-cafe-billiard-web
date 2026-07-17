'use client';
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", roles: ["admin", "kasir_billiard", "kasir_cafe"] },
    { href: "/pos", label: "POS / Kasir", roles: ["admin", "kasir_billiard", "kasir_cafe"] },
    { href: "/meja", label: "Meja", roles: ["admin", "kasir_billiard"] },
    { href: "/products", label: "Produk", roles: ["admin"] },
    { href: "/categories", label: "Kategori", roles: ["admin"] },
    { href: "/transaksis", label: "Transaksi", roles: ["admin"] },
    { href: "/reports", label: "Laporan", roles: ["admin"] },
  ];

  return (
    <header className="bg-[#0d2818] border-b border-[#2d5a27] px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-amber-400 font-bold text-lg tracking-wide flex items-center gap-2">
            <span className="text-2xl">🎱</span>
            <span className="hidden sm:inline">Lumina Billiard</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks
              .filter((l) => l.roles.includes(user.role))
              .map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    pathname === l.href
                      ? "bg-amber-600/20 text-amber-400"
                      : "text-gray-300 hover:text-amber-300 hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 hidden sm:inline">
            {user.name}
            <span className="ml-2 px-2 py-0.5 bg-amber-900/40 text-amber-300 rounded text-xs">
              {user.role.replace("_", " ")}
            </span>
          </span>
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 bg-red-900/30 text-red-300 rounded hover:bg-red-900/50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
