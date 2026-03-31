# Boreal Iron Heavy — B2B Excavator Attachments

**borealiron.ca** · Made in Yantai, China · Sold in Canada

Boreal Iron Heavy (BIH) manufactures and sells heavy-duty excavator attachments for the Canadian construction market. Products are built from Q355 HSLA steel with Hardox 450 wear surfaces, certified CE / ISO 9001 / EN 474, and shipped from Yantai Port.

---

## Product Catalogue

| Category | SKUs | Tonnage Range |
|---|---|---|
| Excavator Buckets | 3 | 1–50T |
| Rake / Skeleton Buckets | 1 | 5–25T |
| Hydraulic Breakers | 2 | 2–30T |
| Quick Couplers | 1 | 5–25T |
| Hydraulic Thumbs | 1 | 5–25T |
| Rippers | 1 | 12–30T |
| Earth Augers | 1 | 5–25T |

OEM compatibility: CAT, John Deere, Komatsu, Kubota, Volvo, Hitachi, Bobcat

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite 6 |
| Styling | TailwindCSS 4 + shadcn/ui (Radix) |
| Routing | React Router 7 |
| Payments | Stripe (CAD) |
| Accounting sync | QuickBooks Online via OAuth2 |
| Shipping rates | Manitoulin Transport API (placeholder) |
| Deployment | Cloudflare Workers (edge) |
| Forms | Web3Forms |

---

## Pages

- `/` — Homepage: hero, value props, product grid, material excellence
- `/products` — Full catalogue with category filter
- `/products/:slug` — Product detail: specs, material, OEM compat, quote form, nameplate badge
- `/compatibility` — OEM compatibility tool: filter by brand/tonnage
- `/steel` — Q355 vs ASTM technical comparison
- `/factory` — Yantai factory story, export routes, production timeline

---

## Local Development

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev                  # Vite dev server at localhost:5173
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe front-end key |
| `VITE_WEB3FORMS_KEY` | Yes | Web3Forms access key for contact/quote forms |
| `STRIPE_SECRET_KEY` | Yes | Stripe server-side key (Workers only) |

Cloudflare secrets (set via `wrangler secret put`):
- `STRIPE_SECRET_KEY`
- `QBO_CLIENT_ID`, `QBO_CLIENT_SECRET`, `QBO_REFRESH_TOKEN`, `QBO_REALM_ID`

---

## Deployment

Production runs on Cloudflare Workers with edge-side API routes.

```bash
npm run build       # Vite build → dist/
npm run deploy      # wrangler deploy to Cloudflare
```

API functions live in `functions/api/`:
- `create-payment-intent.ts` — Stripe payment intent
- `qbo-sync.ts` — QuickBooks Online order sync
- `shipping-rates.ts` — Manitoulin shipping calculator

---

## Naming System

Products follow the scheme `BIH-[CAT]-[SUB][TT]`:

```
BIH-EXC-HD12   Excavator bucket, heavy duty, 12T class
BIH-BRK-SM02   Hydraulic breaker, small, 2T class
BIH-CPL-HY05   Quick coupler, hydraulic, 5T class
```

Physical nameplates (90×50mm laser-cut aluminium) use `nameplate-template.svg`.

---

## Project Structure

```
src/
  app/
    components/     Navbar, Footer, NameplateBadge, ...
    data/           products.ts — single source of truth for all SKUs
    hooks/          useCart, useLanguage, ...
    pages/          HomePage, ProductsPage, ProductDetailPage, ...
  styles/
functions/api/      Cloudflare Workers edge functions
public/             Static assets, favicon, banner
```

---

## Language

All UI is bilingual **EN / FR** (Canadian French). Language toggle in Navbar. Translation strings are inline per component — no i18n library dependency.
