# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.0] - 2026-07-25

### Added
- **`AppConfig` interface + `getAppConfig()`** — fetches `price_per_hour`, `operating_hours`, and `payment` methods from `GET /api/v1/configs`
- **`GuestHistoryItem` type + `getGuestHistory(phone)`** — fetches guest transaction history from `GET /api/v1/guest_transactions/history?phone=`
- TypeScript interfaces for all API entities (User, Product, Meja, Transaksi, AppConfig, GuestHistoryItem)

### Changed
- `login()` response now maps `role_label` from API response to User interface

---

## [v1.0.0-alpha] - 2026-07-24

### Added (Initial Release)
- Next.js 15 with App Router
- Role-based navigation (admin, kasir_billiard, kasir_cafe)
- Dashboard with revenue/transactions summary
- POS (Point of Sale) for billiard and cafe transactions
- Products CRUD with categories
- Tables (Meja) management
- Transaction history and reports
- Dark theme (`#131313` background / `#6bfb9a` accent) with Tailwind CSS v4
- JWT authentication via `localStorage`
- Responsive sidebar + mobile bottom navigation
- GitHub Actions CI/CD — lint, test, build checks
- Commitlint with Conventional Commits rules
- `.gitignore` blocks all AI agent config files (AGENTS.md, CLAUDE.md, CURSOR.md, etc.)