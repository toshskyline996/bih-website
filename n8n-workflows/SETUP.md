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

## Troubleshooting

**Webhook not triggering** — Verify `https://n8n.freightracing.ca` is publicly accessible and the workflow is Active.

**Email sending fails** — Double-check the Gmail App Password (not your account password). Also ensure Less Secure Apps is not blocking (App Passwords bypass this).

**QBO 401 errors** — The refresh token may have expired. Re-run `scripts/qbo-get-tokens.mjs` to get a new one, update the docker-compose env.

**Wait node not resuming** — Ensure the n8n workers are running (`docker compose -p n8n ps`). The Wait node persists in the queue via Redis.
