# PrairieHQ Product Documentation

This package contains the official end-user and operational documentation site for PrairieHQ, powered by [VitePress](https://vitepress.dev).

## Development

To run the local development server with hot-module reloading:

```bash
pnpm --dir docs dev
```

The documentation server will start locally at `http://localhost:5173`.

## Production Build

To build the static site for production deployment:

```bash
pnpm --dir docs build
```

The static files will be generated in `docs/.vitepress/dist`.

To preview the production build locally:

```bash
pnpm --dir docs preview
```

## Structure

```
docs/
├── .vitepress/
│   └── config.ts             # VitePress configuration (navigation, sidebar, search)
├── public/                   # Static assets (logos, favicon, icons)
├── guide/                    # Getting Started, Navigation, Roles & Permissions
├── workbook/                 # Customers, Proposals & Documents, Work Orders, Site Reviews
├── operations/               # Scheduling, Crew Tracking, On-Demand, Winter & Snow
├── resourcing/               # Employees, Clock In/Out, Time Off, Payroll
├── financials/               # Invoices, Daily Financials, P&L, Cash Flow
├── portal/                   # Customer Self-Service Portal & Online Payments
├── index.md                  # Landing page hero and feature highlights
└── package.json
```
