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

## Troubleshooting

**Webhook not triggering** — Verify `https://n8n.freightracing.ca` is publicly accessible and the workflow is Active.

**Email sending fails** — Double-check the Gmail App Password (not your account password). Also ensure Less Secure Apps is not blocking (App Passwords bypass this).

**QBO 401 errors** — The refresh token may have expired. Re-run `scripts/qbo-get-tokens.mjs` to get a new one, update the docker-compose env.

**Wait node not resuming** — Ensure the n8n workers are running (`docker compose -p n8n ps`). The Wait node persists in the queue via Redis.
