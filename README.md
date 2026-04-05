# Boreal Iron Heavy — B2B Excavator Attachments

**freightracing.ca** · Made in Yantai, China · Sold in Canada

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
| State | Zustand (cart store) |
| Maps | Leaflet + react-leaflet |
| Payments | Stripe (CAD) |
| Accounting sync | QuickBooks Online via OAuth2 |
| Shipping rates | Manitoulin Transport API (placeholder) |
| Deployment | Cloudflare Workers + Assets (edge) |
| Forms | Web3Forms |
| QR codes | qrcode + html5-qrcode |

---

## Pages

| Route | Component | Description |
|---|---|---|
| `/` | `HomePage` | Hero, value props, product grid, material excellence |
| `/products` | `ProductsPage` | Full catalogue with category filter |
| `/products/:slug` | `ProductDetailPage` | Specs, material, OEM compat, quote form, nameplate badge |
| `/about` | `AboutPage` | Company story |
| `/steel-spec` | `SteelSpecPage` | Q355 vs ASTM technical comparison |
| `/factory` | `FactoryPage` | Yantai factory story, export routes, production timeline |
| `/compatibility` | `CompatibilityPage` | OEM compatibility tool: filter by brand/tonnage |
| `/contact` | `ContactPage` | Web3Forms contact / quote form |
| `/quote-builder` | `QuoteBuilderPage` | Multi-product quote builder |
| `/cart` | `CartPage` | Shopping cart |
| `/checkout` | `CheckoutPage` | Stripe payment checkout |
| `/order/success` | `OrderSuccessPage` | Post-payment confirmation |
| `/excavator-attachments/:brandSlug` | `BrandLandingPage` | SEO brand landing pages (CAT, Komatsu, etc.) |
| `/intel` | `IntelDashboardPage` | 🔐 Internal — competitive intelligence dashboard |
| `/inventory` | `InventoryPage` | 🔐 Internal — warehouse inventory management |

---

## Worker API Routes

All API routes are handled in `worker.ts` and bridged from `functions/api/`.

### Commerce

| Method | Path | Handler | Description |
|---|---|---|---|
| POST | `/api/shipping-rates` | `shipping-rates.ts` | Manitoulin freight calculator |
| POST | `/api/create-payment-intent` | `create-payment-intent.ts` | Stripe payment intent |
| POST | `/api/qbo-sync` | `qbo-sync.ts` | QuickBooks Online order sync |
| POST | `/api/stripe-webhook` | `stripe-webhook.ts` | Stripe event webhook |

### Intelligence

| Method | Path | Description |
|---|---|---|
| GET | `/api/flights` | OpenSky Pacific route proxy (dual-bbox, 5-min KV cache) |
| POST | `/api/track-compat` | Geo-enrichment proxy → `intel-api.freightracing.ca/ingest/compat` |

### Inventory

All inventory endpoints require `Authorization: Bearer {INVENTORY_ADMIN_SECRET}`.

| Method | Path | Description |
|---|---|---|
| GET | `/api/inventory/ping` | Auth check |
| GET | `/api/inventory/sku` | List SKUs with unit counts |
| POST | `/api/inventory/sku` | Create SKU `{name, model?, category?, notes?}` |
| GET | `/api/inventory/units` | List units (filters: `status`, `sku_id`, `limit`, `offset`) |
| POST | `/api/inventory/inbound` | Batch register units `{sku_id, quantity, location?, cost_cad?, notes?}` |
| POST | `/api/inventory/scan-out` | Mark unit sold `{unit_id}` |
| GET | `/api/inventory/unit/:id` | Get single unit (by UUID or label `BIH-XXXX`) |
| PATCH | `/api/inventory/unit/:id` | Update `status` / `location` / `notes` |

---

## Cloudflare Resources

| Resource | Binding | Name / ID |
|---|---|---|
| KV Namespace | `KV_CACHE` | `04f6f645da47470d92a381bc952ee2e3` — flight proxy cache |
| D1 Database | `INVENTORY_DB` | `bih-inventory` · `0f962fcd-9d52-434b-b3ab-c015980f569a` (WNAM) |

### D1 Schema (`bih-inventory`)

- `inventory_skus` — product SKU definitions
- `inventory_units` — individual serialised units (indexes: `idx_units_sku`, `idx_units_status`, `idx_units_label`)

Migration: `migrations/0001_inventory_init.sql`

---

## Inventory System (`/inventory`)

Internal warehouse management UI (auth-gated via `sessionStorage` key `bih_inventory_key`).

| Tab | Component | Function |
|---|---|---|
| 库存看板 | `InventoryStockPage` | SKU grid + unit table with status filters |
| 入库登记 | `InventoryInboundPage` | SKU select/create + batch register + QR label print |
| 扫码出库 | `InventoryScanPage` | Camera QR scanner → confirm scan-out flow |

**Label format:** `BIH-XXXX` (4-digit auto-increment)
**QR content:** unit UUID (looked up via `/api/inventory/unit/:uuid`)

Components: `QRCodeLabel.tsx` (print labels), `QRScanner.tsx` (camera, uses `html5-qrcode`)

---

## Intel Dashboard (`/intel`)

Internal competitive intelligence dashboard (auth-gated via `sessionStorage` key `bih_intel_key`).

Connects to **`intel-api.freightracing.ca`** (separate Worker project at `bih-intel-api`).

| Panel | Data Source | Description |
|---|---|---|
| Tender Alerts | `bih_intel_v5` D1 · `tender_alerts` | Canada Buys + Ontario government tenders |
| RBA Listings | `bih_intel_v5` D1 · `rba_listings` | RBA / IronPlanet auction prices |
| Freight Rates | `bih_intel_v5` D1 · `freight_rates` | SCFI NA West/East, WoW % change, 4-week MA |
| Compat Events | `bih_intel_v5` D1 · `compat_events` | Compatibility tool search analytics |

`VesselMap` component — Leaflet map of Pacific freight flights (via `/api/flights` OpenSky proxy).

---

## n8n Automation Workflows

Workflows defined in `n8n-workflows/`. See `n8n-workflows/SETUP.md` for activation guide.

| File | ID | Trigger | Function |
|---|---|---|---|
| `wf1-quote-auto-reply.json` | WF1 | Web3Forms webhook | Auto-reply to quote form submissions |
| `wf2-qbo-monthly-report.json` | WF2 | Monthly schedule | QuickBooks revenue report → email |
| `wf3-compat-analytics.json` | WF3 | Webhook | Compat search → Google Sheets + D1 dual-write |
| `wf4-rba-import.json` | WF4 | Manual | Historical RBA data → `/ingest/rba/batch` |
| `wf5-gta-tenders.json` | WF5 | RSS schedule | Canada Buys + Ontario Tenders → D1 → Telegram |
| `wf6-rba-auction-intel.json` | WF6 | Gmail trigger | RBA / IronPlanet email → parse → D1 → Telegram |
| `wf7-freight-rates.json` | WF7 | Friday schedule | Freight rate form → D1 → Telegram |

---

## Local Development

```bash
npm install
cp .env.example .env.local        # front-end Vite vars
cp .dev.vars.example .dev.vars    # Worker secrets for wrangler dev
npm run dev                       # Vite dev server → localhost:5173
npm run preview                   # Full Workers preview (wrangler dev)
```

### Environment Variables

**`.env.local`** (Vite / front-end):

| Variable | Required | Description |
|---|---|---|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `VITE_WEB3FORMS_KEY` | Yes | Web3Forms access key |

**`.dev.vars`** (Cloudflare Worker — local only):

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `QUICKBOOKS_CLIENT_ID` | QBO OAuth2 client ID |
| `QUICKBOOKS_CLIENT_SECRET` | QBO OAuth2 client secret |
| `QUICKBOOKS_REFRESH_TOKEN` | QBO refresh token |
| `QUICKBOOKS_REALM_ID` | QBO company realm ID |
| `QUICKBOOKS_SANDBOX` | `true` for sandbox, omit in production |
| `OPENSKY_CLIENT_ID` | OpenSky Network client ID |
| `OPENSKY_CLIENT_SECRET` | OpenSky Network client secret |
| `INVENTORY_ADMIN_SECRET` | Bearer token for inventory API |
| `MANITOULIN_API_TOKEN` | *(optional)* Manitoulin API token |

**Cloudflare secrets** (set via `wrangler secret put <NAME>`):
All `.dev.vars` secrets above except `QUICKBOOKS_SANDBOX`.

---

## Deployment

```bash
npm run build     # Vite build → dist/ + cp dist/index.html dist/404.html
npm run deploy    # npm run build && wrangler deploy
```

Production: **Cloudflare Workers + Assets** mode.
- Worker entry: `worker.ts`
- Static assets: `dist/` (SPA fallback enabled)
- Routes: `freightracing.ca/*`, `www.freightracing.ca/*`
- Compatibility date: `2025-09-27` · flags: `nodejs_compat`

CI/CD: `.github/workflows/deploy.yml`

---

## Project Structure

```
src/
  app/
    components/     BIHLogo, Navbar, Footer, NameplateBadge, VesselMap
                    QRCodeLabel, QRScanner, figma/ImageWithFallback
                    ui/  (shadcn/ui components)
    data/           products.ts — SKU source of truth
                    compatibility.ts — OEM compat matrix
    hooks/          usePageMeta, usePageTitle
    store/          cartStore.ts (Zustand)
    utils/          canadianTax.ts
    pages/          (see Pages table above)
  styles/           fonts.css, index.css, tailwind.css, theme.css
  main.tsx
functions/api/      Cloudflare Workers edge functions
migrations/         D1 SQL migrations
n8n-workflows/      n8n workflow JSON exports
public/             Static assets, favicon, banner, site.webmanifest
scripts/            qbo-get-tokens.mjs — QBO OAuth2 token helper
```

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

## Language

All public UI is bilingual **EN / FR** (Canadian French). Language toggle in Navbar. Translation strings are inline per component — no i18n library dependency.

Internal tools (`/inventory`, `/intel`) are in Chinese (zh-CN).
