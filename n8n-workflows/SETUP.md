# BIH n8n Workflow Setup

n8n instance: **http://localhost:5678** (or https://n8n.freightracing.ca)

---

## Workflow 1 — Quote Auto-Reply (`wf1-quote-auto-reply.json`)

**What it does:**
1. Receives form submission from BIH website (Contact page + Product detail page)
2. Sends notification email to you (owner) with full customer details + reply-to set to customer
3. Sends auto-acknowledgment email to customer
4. Waits 48 hours
5. Sends follow-up reminder to you if no action taken

### Step 1 — Add Gmail SMTP credential

In n8n → Settings → Credentials → Add → **SMTP**:

| Field | Value |
|---|---|
| Name | `Gmail SMTP` |
| Host | `smtp.gmail.com` |
| Port | `465` |
| Secure | ✅ SSL |
| User | `antonequipmentca@gmail.com` |
| Password | [Gmail App Password] |

> To create a Gmail App Password: Google Account → Security → 2-Step Verification → App passwords → Generate for "Mail / Other".

### Step 2 — Import workflow

n8n → Workflows → **Import from file** → select `wf1-quote-auto-reply.json`

After import, open each **email node** and re-select the `Gmail SMTP` credential.

### Step 3 — Activate

Toggle the workflow to **Active**. The webhook URL will be:
```
https://n8n.freightracing.ca/webhook/bih-quote
```
This URL is already hardcoded in the BIH website forms.

---

## Workflow 2 — QBO Monthly Report (`wf2-qbo-monthly-report.json`)

**What it does:**
- Runs at 8:00 AM on the 1st of every month (Toronto time)
- Fetches all Sales Receipts from last month via QuickBooks Online API
- Calculates: total revenue, order count, avg order value, top 5 products
- Sends formatted report to your Telegram

### Step 1 — Add QBO credentials as n8n environment variables

Edit the docker-compose.yml to add these to `x-n8n-common-env`:

```yaml
QUICKBOOKS_CLIENT_ID: "your_client_id"
QUICKBOOKS_CLIENT_SECRET: "your_client_secret"
QUICKBOOKS_REFRESH_TOKEN: "your_refresh_token"
QUICKBOOKS_REALM_ID: "your_realm_id"
```

These are the same values from your Cloudflare Workers `.env.production`.  
`N8N_BLOCK_ENV_ACCESS_IN_NODES: false` is already set — n8n can read them as `$env.QUICKBOOKS_*`.

Restart containers after editing:
```bash
docker compose -p n8n up -d
```

### Step 2 — Add Telegram credential

n8n → Settings → Credentials → Add → **Telegram**:

| Field | Value |
|---|---|
| Name | `BIH Telegram Bot` |
| Access Token | `8419007204:AAEXfateBdUnJ63EAP48Sb6QNSb-ye8qk9o` |

### Step 3 — Import workflow

n8n → Workflows → **Import from file** → select `wf2-qbo-monthly-report.json`

After import, open the **Telegram Report** node and re-select the `BIH Telegram Bot` credential.

### Step 4 — Test manually

Before activating, click **Test workflow** to run it immediately and verify the Telegram message arrives.

### Step 5 — Activate

Toggle to **Active**. It will run automatically on the 1st of each month at 8AM.

---

## Workflow 3 — Compat Analytics + Weekly Report (`wf3-compat-analytics.json`)

**What it does:**
- **Event receiver**: Receives search events from the OEM Compatibility Finder (brand selected, model selected, no results, product clicked) and appends each row to a Google Sheet.
- **Weekly cron**: Every Monday at 8 AM, reads the sheet, aggregates the past 7 days, and sends a formatted Telegram report with top brands, top models, no-match models, and most-clicked products.

### n8n vs Openclaw role

| Tool | Role |
|---|---|
| **n8n (this workflow)** | Receives events → stores to Google Sheet → sends automated weekly digest |
| **Openclaw (Telegram agent)** | Ad-hoc AI analysis — DM it "analyze compat data" and it reads the sheet + gives business insights |

### Step 1 — Create a Google Sheet

Create a new Google Sheet named **BIH Analytics** with a tab named **BIH Compat Events**.  
Add these column headers in row 1:

```
timestamp | event | brand | model | tonnage | productCount | productId | productName
```

Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`

**Your Sheet ID:** `1bgH9QpAQQ-HqPUAIWXEA0o8a6VKacuqq`

> ⚠️ The Sheet ID is **only the string between `/d/` and `/edit`** — do NOT paste the full URL.

### Step 2 — Create Google Cloud OAuth2 credentials

n8n's Google Sheets uses **your own** Google Cloud OAuth app (Client ID + Secret). One-time setup:

**2a. Go to Google Cloud Console**

Open https://console.cloud.google.com → select or create a project (e.g. "BIH n8n")

**2b. Enable APIs**

APIs & Services → Library → search and enable both:
- **Google Sheets API**
- **Google Drive API**

**2c. Create OAuth credentials**

APIs & Services → Credentials → **Create Credentials** → **OAuth client ID**:

| Field | Value |
|---|---|
| Application type | Web application |
| Name | `n8n BIH` |
| Authorized redirect URIs | `https://n8n.freightracing.ca/rest/oauth2-credential/callback` |

Click **Create** → copy the **Client ID** and **Client Secret**.

> If prompted to configure consent screen first: External → fill App name "BIH n8n", your email → Save. Then go back to create the OAuth client ID.

**2d. Add credential in n8n**

n8n → Settings → Credentials → Add → **Google Sheets OAuth2 API**:

| Field | Value |
|---|---|
| Name | `Google Sheets — BIH` |
| Client ID | (paste from 2c) |
| Client Secret | (paste from 2c) |

Click **Sign in with Google** → authorize with your Google account → Save.

### Step 3 — Set n8n variables

In n8n → Settings → Variables, add:

| Variable | Value |
|---|---|
| `COMPAT_SHEET_ID` | The Google Sheet ID from Step 1 |
| `TELEGRAM_CHAT_ID` | `1924188362` (your Telegram user ID) |

### Step 4 — Import workflow

n8n → Workflows → **Import from file** → select `wf3-compat-analytics.json`

After import:
- Open **Google Sheets — Append Row** node → re-select `Google Sheets — BIH` credential
- Open **Google Sheets — Read All** node → re-select the same credential
- Open **Telegram — Send Weekly Report** node → re-select `BIH Telegram Bot` credential

### Step 5 — Activate

Toggle to **Active**. The webhook URL will be:
```
https://n8n.freightracing.ca/webhook/bih-compat-event
```
This URL is already hardcoded in `CompatibilityPage.tsx`.

### Step 6 — Verify

Visit `/compatibility`, select a brand and model, then check the Google Sheet — a new row should appear within seconds.

---

---

## OpenClaw ↔ n8n Integration

### Architecture

| Direction | Mechanism | What it does |
|---|---|---|
| **n8n → OpenClaw** | HTTP POST to `/hooks/agent` | WF3 sends weekly aggregated data → OpenClaw adds AI business insights → Telegram |
| **OpenClaw → n8n** | `n8n` MCP server | Agent can query workflow status, execution history, or trigger runs on demand via Telegram chat |

### Hooks endpoint (n8n → OpenClaw)

OpenClaw gateway listens at `http://127.0.0.1:18789`. WF3 calls it after the weekly stats report:

```
POST http://127.0.0.1:18789/hooks/agent
Authorization: Bearer bih-hooks-n8n-7f3a9c2d1e8b
Content-Type: application/json
```

The `OpenClaw — AI Business Insights` node in WF3 sends the aggregated summary and asks for:
1. Inventory gap analysis (high-search models with no product matches)
2. Brand/model trend interpretation
3. 1-3 actionable product/marketing recommendations

OpenClaw responds via Telegram directly to chat ID `1924188362`, using `anyrouter/claude-opus-4-6`.

### n8n MCP (OpenClaw → n8n)

The `n8n` MCP server is configured in `~/.openclaw/openclaw.json`. From Telegram you can now ask:
- "n8n 状态" — check workflow active/inactive status
- "上次周报执行成功了吗" — query WF3 execution history
- "手动触发一次 WF2" — trigger the QBO monthly report (with exec approval)

### Key values

| Item | Value |
|---|---|
| Hooks token | `bih-hooks-n8n-7f3a9c2d1e8b` |
| Gateway port | `18789` |
| n8n API URL | `https://n8n.freightracing.ca/api/v1` |

### Re-import WF3

After this update, re-import `wf3-compat-analytics.json` in n8n to get the new `OpenClaw — AI Business Insights` node. No new credentials needed — it uses plain HTTP with the bearer token above.

---

## Workflow 4 — RBA Historical Full-Load (`wf4-rba-historical-load.json`)

**What it does:**
- One-time manual workflow — run once to bulk-import historical RBA / IronPlanet auction data into D1
- Reads all rows from a Google Sheet (`RBA Historical` tab)
- Normalizes and validates each row (skips rows missing `listing_id`, `title`, or `price_cad`)
- Splits rows into batches of 100 → POSTs each batch to `/ingest/rba/batch`
- Workers AI auto-classifies each listing (brand, category, tonnage_class)
- Waits 200ms between batches to prevent D1 write backpressure
- Sends a Telegram completion message with a link to the Intel Dashboard

> **Run once, then disable.** Duplicate rows are silently skipped (`INSERT OR IGNORE`), so re-running is safe but unnecessary.

### Step 1 — Prepare the Google Sheet

Create a new tab named **`RBA Historical`** inside the existing **BIH Analytics** Google Sheet (same sheet used by WF3).

Add these column headers in row 1:

```
listing_id | title | price_cad | sale_date | category_raw | location | url
```

| Column | Required | Notes |
|---|---|---|
| `listing_id` | ✅ | Unique ID, e.g. `RBA-12345` |
| `title` | ✅ | Auction listing title, e.g. `2018 CAT 336F Bucket` |
| `price_cad` | ✅ | Final sale price in CAD (number only) |
| `sale_date` | ✅ | Format `YYYY-MM-DD` |
| `category_raw` | ✗ | Optional raw category string from RBA |
| `location` | ✗ | Optional province/city |
| `url` | ✗ | Optional listing URL |

> The workflow is flexible with column names — it also recognizes `Listing ID`, `Title`, `Price (CAD)`, `Sale Date`, `Category`, `Location`, `Link` as aliases.

### Step 2 — Add n8n Variable

In n8n → **Settings** → **Variables**, add:

| Variable | Value |
|---|---|
| `RBA_HISTORICAL_SHEET_ID` | The Google Sheet ID (same sheet as `COMPAT_SHEET_ID`, just the ID string between `/d/` and `/edit`) |

### Step 3 — Import workflow

n8n → Workflows → **Import from file** → select `wf4-rba-historical-load.json`

After import:
- Open **Google Sheets — RBA Historical** node → re-select `Google Sheets — BIH` credential
- Open **Telegram — Load Complete** node → re-select `BIH Telegram Bot` credential

### Step 4 — Run manually

Click **Test workflow** (or **Execute Workflow**). The workflow will:
1. Read all rows from the sheet
2. Log the count of valid rows in the **Filter — Valid Rows** node output
3. Send batches of 100 to the API (Workers AI classifies each one)
4. Send a Telegram message when complete

> **Large datasets (>1000 rows):** Workers AI classification adds ~300ms per row. 1000 rows ≈ 5–10 minutes. Run during off-hours.

### Step 5 — Verify & disable

1. Open the **Intel Dashboard** at `https://freightracing.ca/intel`
2. Check the RBA section for the imported listings
3. **Disable the workflow** after confirming data looks correct

---

## Workflow 5 — GTA Tender Alert (`wf5-gta-tender.json`)

**What it does:**
- Runs weekdays at 8 AM
- Fetches tenders from **two RSS sources in parallel**: Canada Buys (federal) + Ontario Tenders
- Merges both feeds → filters by BIH-relevant keywords (14 priority + 16 general)
- Tries to extract closing deadline from tender content
- POSTs each matched tender to `https://intel-api.freightracing.ca/ingest/tender` — duplicates silently ignored
- Aggregates newly inserted tenders → Telegram alert with dashboard link
- Silent when 0 new results (no spam on quiet days)

> **RSS URL note:** Primary source is `canadabuys.canada.ca/en/tender-opportunities.rss`. If it fails try `https://canadabuys.canada.ca/en/rss` as alternate. Both RSS nodes have `continueOnFail: true` so one failing source won't abort the run.

### Step 1 — Confirm n8n Variables

In n8n → **Settings** → **Variables**, confirm these exist:

| Variable | Value |
|---|---|
| `BIH_API_SECRET` | `8bb3f1dc854dd8734045309f5d9485df79a1311ba7a139c8f0b6c34dd743e63a` |
| `TELEGRAM_CHAT_ID` | `1924188362` |

### Step 2 — Re-import updated workflow

Delete the existing WF5 in n8n, then: Workflows → **Import from file** → select `wf5-gta-tender.json`

After import, open **Telegram — Alert** → re-select `BIH Telegram Bot` credential.

### Step 3 — Test manually

Click **Test workflow**. Check the **Parse & Filter** node output for matched items. If 0 matched the workflow stops silently (expected on days with no relevant tenders).

> **Tip:** To force a test Telegram message, temporarily disable the **New Only** filter node.

### Step 4 — Activate

Toggle to **Active**. Runs Monday–Friday at 8 AM automatically.

---

## Workflow 6 — RBA Auction Intelligence (`wf6-rba-auction-intel.json`)

**What it does:**
- Polls Gmail every **15 minutes** for unread RBA / IronPlanet saved-search alert emails
- Two-strategy HTML parser:
  - **Strategy 1:** Scans `<a>` tags pointing to `rbauction.com` / `ironplanet.com` listing URLs — extracts title from anchor text, price from surrounding context (8 patterns tried in specificity order), location from context
  - **Strategy 2 fallback:** Whole-email single-listing for short price-drop alerts
- Validates `price_cad > 0`, non-empty `listing_id` and `title` before posting
- POSTs each valid listing to `https://intel-api.freightracing.ca/ingest/rba` — Workers AI auto-classifies brand + category
- Aggregates new insertions → Telegram alert sorted cheapest first, includes AI classification

> RBA and IronPlanet block all scraping. Gmail saved-search alerts are the only reliable data source.

### Step 1 — Create RBA / IronPlanet saved searches

1. Go to **https://www.rbauction.com** → Sign Up (free)
2. Create saved searches for: `excavator bucket`, `hydraulic attachment`, `excavator thumb ripper` — each with Location: **Canada**, Alert: **Daily digest**
3. Repeat at **https://www.ironplanet.com** with the same terms

First alert emails arrive within 24 hours. Note the exact sender address (e.g. `alerts@rbauction.com`).

### Step 2 — Enable Gmail API in Google Cloud

In the existing Google Cloud project (same one used for WF3 Google Sheets):

APIs & Services → Library → search **Gmail API** → Enable

Confirm `https://n8n.freightracing.ca/rest/oauth2-credential/callback` is an authorized redirect URI.

### Step 3 — Add Gmail OAuth2 credential in n8n

n8n → Settings → Credentials → Add → **Gmail OAuth2 API**:

| Field | Value |
|---|---|
| Name | `Gmail OAuth2 — BIH` |
| Client ID | (same Google Cloud project as WF3) |
| Client Secret | (same project) |

Click **Sign in with Google** → authorize with `antonequipmentca@gmail.com` → Save.

### Step 4 — Re-import updated workflow

Delete the existing WF6, then: Workflows → **Import from file** → select `wf6-rba-auction-intel.json`

After import:
- Open **Gmail — RBA Alerts** node → re-select `Gmail OAuth2 — BIH` credential
- Update the **Sender** filter to the exact sender from your first RBA alert email
- Open **Telegram — Auction Alert** node → re-select `BIH Telegram Bot` credential

### Step 5 — Activate

Toggle to **Active**. The workflow polls Gmail every 15 minutes.

When alert emails arrive:
- HTML parsed with anchor-scan + fallback strategies → listings extracted
- Posted to `intel-api.freightracing.ca/ingest/rba` → Workers AI classifies each (brand, category, confidence)
- Telegram shows new listings sorted cheapest first with AI classification result

---

## Workflow 7 — Weekly Freight Rate Logger (`wf7-freight-rates.json`)

**What it does:**
- Every Friday at 2 PM — sends a Telegram reminder with a link to the rate entry form
- You fill in that week's actual freight rates from your forwarder (takes ~1 min)
- Rates are POSTed to the BIH Intel API (`/ingest/freight`) and stored in D1
- Telegram confirmation sent immediately after submission (inserted / duplicate / error)

> All public SCFI/FBX indices require paid subscriptions. Storing your **actual negotiated rates** from your freight forwarder is more accurate and more useful for cost analysis.

### Step 1 — Import workflow

n8n → Workflows → **Import from file** → select `wf7-freight-rates.json`

After import, open both **Telegram** nodes and re-select the `BIH Telegram Bot` credential.

### Step 2 — Activate

Toggle to **Active**. Two things now work:

| Trigger | What happens |
|---|---|
| Every Friday 2 PM | Telegram message sent to you with the form link |
| Form submitted | Rates validated → posted to D1 → Telegram confirmation |

### Step 3 — Bookmark the form URL

The rate entry form is permanently available at:
```
https://n8n.freightracing.ca/form/bih-freight-rates
```

Bookmark it. Every Friday when your forwarder sends the weekly rate sheet, open the form, enter the numbers, done.

### Form fields

| Field | Required | Notes |
|---|---|---|
| Date (YYYY-MM-DD) | ✅ | The Friday date of that week |
| NA West (China→Vancouver) | ✅ | USD per 40ft container |
| NA East (China→Montreal) | ✗ | Optional |
| Europe (China→Europe) | ✗ | Optional |
| Notes | ✗ | Forwarder name, vessel, surcharges |

---

## Troubleshooting

**Webhook not triggering** — Verify `https://n8n.freightracing.ca` is publicly accessible and the workflow is Active.

**Email sending fails** — Double-check the Gmail App Password (not your account password). Also ensure Less Secure Apps is not blocking (App Passwords bypass this).

**QBO 401 errors** — The refresh token may have expired. Re-run `scripts/qbo-get-tokens.mjs` to get a new one, update the docker-compose env.

**Wait node not resuming** — Ensure the n8n workers are running (`docker compose -p n8n ps`). The Wait node persists in the queue via Redis.
