# Kronos AI

Conversion-focused SaaS site for `kronos.rest`, built with Vite, React, Cloudflare Workers, and Cloudflare Pages.

## Local

```bash
npm ci
npm run build
npm run dev
```

## Cloudflare

Worker deployment:

```bash
npm run cloudflare:deploy
```

Pages deployment:

```bash
npm run pages:deploy
```

Payment uses Creem through `/api/checkout`. Configure `API_PROD_KEY` as a Cloudflare secret for the Worker and Pages production environment.

