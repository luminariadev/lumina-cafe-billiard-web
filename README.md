# Lumina Cafe Billiard — Web App

[![CI](https://github.com/luminariadev/lumina-cafe-billiard-web/actions/workflows/ci.yml/badge.svg)](https://github.com/luminariadev/lumina-cafe-billiard-web/actions)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits)](https://conventionalcommits.org)

Next.js 16 dashboard untuk admin & kasir. Dark theme dengan neon green (#6bfb9a), role-based navigation, responsive mobile-first.

---

## Tech Stack

- **Framework:** Next.js 16.2 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss` + `@theme`)
- **UI:** React 19, Server & Client Components
- **Icons:** Inline SVG (Material Symbols style)
- **Auth:** JWT (context-based, stored in memory)

---

## Quick Start

```bash
# Clone & masuk
git clone https://github.com/luminariadev/lumina-cafe-billiard-web.git
cd lumina-cafe-billiard-web

# Install dependencies
npm install

# Jalankan dev server
npx next dev -p 3002

# Buka di browser
open http://localhost:3002
```

> Dev server berjalan di **port 3002**  
> Backend API harus aktif di `http://localhost:3000/api/v1`

---

## Fitur Utama

- **Dashboard:** Ringkasan pendapatan harian, produk terlaris, dan statistik transaksi.
- **Admin & Kasir POS:** Sistem Point-of-Sale untuk transaksi cafe, manajemen meja, dan produk.
- **Manajemen Data:** CRUD untuk produk, kategori, dan meja billiard.
- **Autentikasi:** Login berbasis JWT dengan role admin, kasir billiard, dan kasir cafe.
- **Guest History:** Melihat riwayat transaksi guest berdasarkan nomor HP.

---

## Fitur

### Per Role

| Fitur | Admin | Kasir Billiard | Kasir Cafe |
|-------|-------|---------------|------------|
| **Dashboard** | ✅ Hari ini + grafik | ✅ Ringkasan | ✅ Ringkasan |
| **POS Billiard** | ✅ | ✅ | ❌ |
| **POS Cafe** | ✅ | ❌ | ✅ |
| **Transaksi** | ✅ Semua | ✅ Billiard only | ✅ Cafe only |
| **Produk** | ✅ CRUD | ✅ Read-only | ✅ Read-only |
| **Meja** | ✅ CRUD | ✅ Read-only | ❌ |
| **Laporan** | ✅ | ✅ | ✅ |
| Kategori | ❌* | ❌* | ❌* |

*\*Categories dihapus dari navigasi (dianggap kurang berdampak), namun endpoint tetap aktif.*

### Navigasi

| Role | Tampilan |
|------|----------|
| **Admin** | Sidebar drawer (hamburger) + Desktop sidebar |
| **Kasir Billiard** | Bottom navigation bar |
| **Kasir Cafe** | Bottom navigation bar |

### Layout

- **Login:** Halaman billiard balls animasi + form login
- **Dashboard:** Stat cards (hari ini), transaksi terbaru, laporan
- **POS:** Tabs (billiard / cafe) sesuai role, cart panel, checkout
- **Produk:** Grid cards dengan preview modal, CRUD via modal form
- **Meja:** Table grid dengan status indicator, select durasi dropdown
- **Transaksi:** Table dengan filter tanggal, status badge
- **Laporan:** Form filter tanggal, summary cards, table detail

---

## Project Structure

```
src/
├── app/
│   ├── login/page.tsx          # Halaman login
│   ├── dashboard/page.tsx      # Dashboard utama
│   ├── pos/page.tsx            # POS (billiard / cafe)
│   ├── transactions/page.tsx   # Daftar transaksi
│   ├── products/page.tsx       # Manajemen produk
│   ├── meja/page.tsx           # Manajemen meja
│   └── categories/page.tsx     # Manajemen kategori
├── components/
│   ├── Sidebar.tsx             # Sidebar admin
│   ├── TopNav.tsx              # Top navigation + hamburger
│   ├── BottomNav.tsx           # Bottom nav kasir
│   ├── AuthGuard.tsx           # Auth wrapper + redirect
│   ├── LoadingScreen.tsx       # Loading state
│   └── POS/
│       ├── BilliardTab.tsx     # POS billiard
│       └── CafeTab.tsx         # POS cafe
├── context/
│   ├── AuthContext.tsx         # Auth context (login/logout/role)
│   └── CartContext.tsx         # Cart state (POS)
└── lib/
    └── api.ts                  # API client + type definitions
```

---

## Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lumina.local | admin123 |
| Kasir Billiard | kasir.billiard@lumina.local | kasir123 |
| Kasir Cafe | kasir.cafe@lumina.local | kasir123 |

---

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api/v1` | Base URL API backend |
| `NEXT_PUBLIC_APP_NAME` | `Lumina` | Nama aplikasi |

---

## Styling

Tailwind v4 dengan custom theme di `globals.css`:

```css
@theme {
  --color-primary: #6bfb9a;
  --color-surface: #131313;
  --color-surface-alt: #1a1a1a;
  --color-on-surface: #ffffff;
  --color-on-surface-variant: rgba(255,255,255,0.6);
  --font-sans: "Inter", sans-serif;
}
```

Semua komponen menggunakan utility classes — tidak ada CSS modules atau `<style jsx>`.

---

## Build & Deploy

```bash
# Build production
npm run build

# Start production server
npm start

# Deploy ke Vercel
npx vercel --prod
```

Web app sudah siap deploy ke Vercel tanpa konfigurasi tambahan.
```2026-07-29 19:42
# Last synced: 2026-07-30 17:41:02 WIB
# Manual sync: 2026-07-30 17:45:22 WIB
# Daily sync: 2026-07-31 17:30:55 WIB
# Re-sync (31 July): 2026-07-31 17:40:01 WIB
# sync: 2026-07-31 18:23:25
# sync: 2026-07-31 18:23:26
# sync: 2026-07-31 18:23:27
# Last synced: 2026-07-31 18:23:43 SEAST
# sync: 2026-08-01 09:22:19
# sync: 2026-08-01 09:22:20
# sync: 2026-08-01 09:22:21
# sync: 2026-08-03 23:25:16
# sync: 2026-08-03 23:25:17
# sync: 2026-08-03 23:25:19
# sync: 2026-08-08 19:59:10
# sync: 2026-08-08 19:59:11
# sync: 2026-08-08 19:59:12
# sync: 2026-08-11 19:29:13
# sync: 2026-08-11 19:29:13
# sync: 2026-08-11 19:29:14
# sync: 2026-08-12 16:54:24
# sync: 2026-08-12 16:54:24
# sync: 2026-08-12 16:54:24
# sync: 2026-08-14 17:40:20
# sync: 2026-08-14 17:40:22
# sync: 2026-08-14 17:40:23
# sync: 2026-08-18 09:01:22
# sync: 2026-08-18 09:01:23
# sync: 2026-08-18 09:01:25
# sync: 2026-08-23 15:13:26
# sync: 2026-08-23 15:13:32
# sync: 2026-08-23 15:13:37
# sync: 2026-08-24 18:39:45
# sync: 2026-08-24 18:39:46
# sync: 2026-08-24 18:39:47
# sync: 2026-08-26 14:03:06
# sync: 2026-08-26 14:03:06
# sync: 2026-08-26 14:03:06
