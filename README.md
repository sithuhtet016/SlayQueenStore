# Slay Queen Store

Full-stack React Router app for Slay Queen: blind boxes, K-beauty, wallets, and bags. Includes cart, checkout with FormSubmit, category navigation with hash syncing, and product search.

## Features

- SSR-ready React Router v7 with TypeScript
- Cart with variants and currency formatting
- Checkout with payment-proof upload via FormSubmit
- Category hash highlighting and menu hash tracking
- Product search (tag-based) with image fallbacks

## Tech Stack

- React 19, React Router 7 (full-stack)
- TypeScript
- Tailwind CSS (via PostCSS config baked into the template)
- Vite tooling for dev/build

## Getting Started

Install dependencies:

```bash
npm install
```

Run locally with HMR:

```bash
npm run dev
```

Type generation + type check:

```bash
npm run typecheck
```

## Build

```bash
npm run build
```

Output lives in `build/client` (static) and `build/server` (server entry). Start locally after build:

```bash
npm start
```

## Deploy (Render example)

- Create a Render Web Service from the GitHub repo.
- Build command: `npm run build`
- Start command: `npm start`
- Runtime: Node 20+
- Add your custom domain in Render → Custom Domains; point DNS (A/ALIAS for apex, CNAME for www) per Render’s instructions and wait for SSL.

## Notes

- Product catalog: `public/data/products.json`
- Cart state persists in `localStorage` via `cart-context`.
- Checkout posts to FormSubmit; ensure the primary recipient address is correct before going live.
